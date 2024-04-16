const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const BeritaModal = require("../model/beritaModal.js");
const ReporterModal = require("../model/reporterModal.js");
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
    let rows = await BeritaModal.getAll();
    res.render("berita/index", {
      data: rows,
      userEmail: userEmail,
    });
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
    res.redirect("/berita");
  }
});

router.get("/create", async function (req, res, next) {
  let rows = await ReporterModal.getAll();
  let userEmail = req.userEmail;
  res.render("berita/create", {
    data: rows,
    userEmail: userEmail,
    judul: "",
    isi: "",
    tanggal_publish: "",
    reporter_id: "",
    gambar: "",
  });
});

router.post("/store", upload.single("gambar"), async function (req, res, next) {
  let currentDate = new Date();
  let formattedTime = currentDate.toISOString().split("T")[0];

  try {
    let { judul, reporter_id, isi } = req.body;
    let data = {
      judul: judul,
      isi: isi,
      tanggal_publish: formattedTime,
      reporter_id: reporter_id,
      gambar: req.file.filename,
    };
    await BeritaModal.store(data);
    req.flash("success", "Berhasil menyimpan data");
    res.redirect("/berita");
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
    res.redirect("/berita");
  }
});

router.get("/edit/:id", async function (req, res, next) {
  try {
    let reporter = await ReporterModal.getAll();
    let id = req.params.id;
    let userEmail = req.userEmail;
    let rows = await BeritaModal.getById(id);
    res.render("berita/edit", {
      data: reporter,
      userEmail: userEmail,
      id: rows[0].id,
      judul: rows[0].judul,
      tanggal_publish: rows[0].tanggal_publish,
      isi: rows[0].isi,
      reporter_id: rows[0].reporter_id,
      gambar: rows[0].gambar,
    });
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
    res.redirect("/berita");
  }
});

router.post(
  "/update/:id",
  upload.single("gambar"),
  async function (req, res, next) {
    try {
      let id = req.params.id;
      let filebaru = req.file ? req.file.filename : null;
      let rows = await BeritaModal.getById(id);
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
      let gambar = filebaru || namaFileLama;
      let { judul, isi, reporter_id } = req.body;
      let data = {
        judul: judul,
        isi: isi,
        reporter_id: reporter_id,
        tanggal_publish: formattedTime,
        gambar: gambar,
      };
      await BeritaModal.update(id, data);
      req.flash("success", "Berhasil memperbarui data");
      res.redirect("/berita");
    } catch (error) {
      req.flash("error", error.message || "Terjadi kesalahan pada server");
      res.redirect("/berita");
    }
  }
);

router.get("/delete/:id", async function (req, res) {
  try {
    let id = req.params.id;
    let rows = await BeritaModal.getById(id);
    const namaFileLama = rows[0].gambar;
    if (namaFileLama) {
      const pathFileLama = path.join(
        __dirname,
        "../public/images/upload",
        namaFileLama
      );
      fs.unlinkSync(pathFileLama);
    }
    await BeritaModal.delete(id);
    req.flash("success", "Berhasil menghapus data");
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
  }
  res.redirect("/berita");
});

module.exports = router;
