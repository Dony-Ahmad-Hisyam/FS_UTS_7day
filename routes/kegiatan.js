const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const KegiatanModal = require("../model/kegiatanModal.js");
const modelUser = require("../model/modelUser.js");

router.use(async function (req, res, next) {
  try {
    let userData = await modelUser.getId(req.session.userId);
    if (userData.length > 0 && userData[0].email == "samtole@gmail.com") {
      let userEmail = userData[0].email;
      req.userEmail = userEmail;
    } else {
      return res.redirect("/logout");
    }
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
    return res.redirect("/logout");
  }
  next();
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/upload");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.get("/", async function (req, res, next) {
  try {
    let userEmail = req.userEmail;
    let rows = await KegiatanModal.getAll();
    res.render("kegiatan/index", {
      data: rows,
      userEmail: userEmail,
    });
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
    res.redirect("/kegiatan");
  }
});

router.get("/create", function (req, res, next) {
  let userEmail = req.userEmail;
  res.render("kegiatan/create", {
    nama: "",
    userEmail: userEmail,
    tanggal: "",
    tempat: "",
    deskripsi: "",
    waktu: "",
  });
});

router.post("/store", upload.single("gambar"), async function (req, res, next) {
  let currentDate = new Date();
  let formattedTime = currentDate.toISOString().split("T")[0];

  try {
    let { nama, tanggal, tempat, deskripsi, waktu } = req.body;
    let data = {
      nama: nama,
      tanggal: tanggal,
      deskripsi: deskripsi,
      tempat: tempat,
      waktu: formattedTime,
      gambar: req.file.filename,
    };
    await KegiatanModal.store(data);
    req.flash("success", "Berhasil menyimpan data");
    res.redirect("/kegiatan");
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
    res.redirect("/kegiatan");
  }
});

router.get("/edit/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let rows = await KegiatanModal.getById(id);
    let userEmail = req.userEmail;
    res.render("kegiatan/edit", {
      id: rows[0].kegiatan_id,
      userEmail: userEmail,
      nama: rows[0].nama,
      tanggal: rows[0].tanggal,
      tempat: rows[0].tempat,
      deskripsi: rows[0].deskripsi,
      waktu: rows[0].formattedDate,
      gambar: rows[0].gambar,
    });
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
    res.redirect("/kegiatan");
  }
});

router.post(
  "/update/:id",
  upload.single("gambar"),
  async function (req, res, next) {
    try {
      let id = req.params.id;
      let filebaru = req.file ? req.file.filename : null;
      let rows = await KegiatanModal.getById(id);
      let currentDate = new Date();
      let formattedTime = currentDate.toISOString().split("T")[0];
      const namaFileLama = rows[0].gambar;
      if (filebaru && namaFileLama) {
        const pathFileLama = path.join(
          __dirname,
          "../public/images/upload",
          namaFileLama
        );
        fs.unlinkSync(pathFileLama);
      }
      let { nama, tanggal, tempat, deskripsi } = req.body;
      let gambar = filebaru || namaFileLama;
      let data = {
        nama: nama,
        tanggal: tanggal,
        deskripsi: deskripsi,
        tempat: tempat,
        waktu: formattedTime,
        gambar: gambar,
      };
      await KegiatanModal.update(id, data);
      req.flash("success", "Berhasil memperbarui data");
      res.redirect("/kegiatan");
    } catch (error) {
      req.flash("error", error.message || "Terjadi kesalahan pada server");
      res.redirect("/kegiatan");
    }
  }
);

router.get("/delete/:id", async function (req, res) {
  try {
    let id = req.params.id;
    let rows = await KegiatanModal.getById(id);
    const namaFileLama = rows[0].gambar;
    if (namaFileLama) {
      const pathFileLama = path.join(
        __dirname,
        "../public/images/upload",
        namaFileLama
      );
      fs.unlinkSync(pathFileLama);
    }
    await KegiatanModal.delete(id);
    req.flash("success", "Berhasil menghapus data");
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
  }
  res.redirect("/kegiatan");
});

module.exports = router;
