const express = require("express");
const router = express.Router();
const kegiatanMahasiswa = require("../model/kegiatanMahasiswaModal.js");
const MahasiswaModal = require("../model/mahasiswaModal.js");
const KegiatanModal = require("../model/kegiatanModal.js");
const modelUser = require("../model/modelUser.js");
const kegiatanMahasiswaModal = require("../model/kegiatanMahasiswaModal.js");

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

router.get("/", async function (req, res, next) {
  try {
    let userEmail = req.userEmail;
    let rows = await kegiatanMahasiswa.getAll();
    res.render("kegiatan_mahasiswa/index", {
      data: rows,
      userEmail: userEmail,
    });
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
    res.redirect("/kegiatan_mahasiswa");
  }
});

router.get("/create", async function (req, res, next) {
  let rows = await MahasiswaModal.getAll();
  let userEmail = req.userEmail;
  let rows2 = await KegiatanModal.getAll();
  res.render("kegiatan_mahasiswa/create", {
    data: rows,
    data2: rows2,
    userEmail: userEmail,
    mahasiswa_id: "",
    kegiatan_id: "",
  });
});

router.post("/store", async function (req, res, next) {
  try {
    let { mahasiswa_id, kegiatan_id } = req.body;
    let data = {
      mahasiswa_id: mahasiswa_id,
      kegiatan_id: kegiatan_id,
    };
    await kegiatanMahasiswa.store(data);
    req.flash("success", "Berhasil menyimpan data");
    res.redirect("/kegiatan_mahasiswa");
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
    res.redirect("/kegiatan_mahasiswa");
  }
});

router.get("/edit/:id", async function (req, res, next) {
  try {
    let rows1 = await MahasiswaModal.getAll();
    let rows2 = await KegiatanModal.getAll();
    let id = req.params.id;
    let rows = await kegiatanMahasiswa.getById(id);
    let userEmail = req.userEmail;
    res.render("kegiatan_mahasiswa/edit", {
      data: rows1,
      data2: rows2,
      id: rows[0].kegiatan_mahasiswa_id,
      mahasiswa_id: rows[0].mahasiswa_id,
      userEmail: userEmail,
      kegiatan_id: rows[0].kegiatan_id,
    });
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
    res.redirect("/kegiatan_mahasiswa");
  }
});

router.post("/update/:id", async function (req, res, next) {
  try {
    let id = req.params.id;

    let { mahasiswa_id, kegiatan_id } = req.body;
    let data = {
      mahasiswa_id: mahasiswa_id,
      kegiatan_id: kegiatan_id,
    };
    await kegiatanMahasiswa.update(id, data);
    req.flash("success", "Berhasil memperbarui data");
    res.redirect("/kegiatan_mahasiswa");
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
    res.redirect("/kegiatan_mahasiswa");
  }
});

router.get("/delete/:id", async function (req, res) {
  try {
    let id = req.params.id;
    await kegiatanMahasiswa.delete(id);
    req.flash("success", "Berhasil menghapus data");
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
  }
  res.redirect("/kegiatan_mahasiswa");
});

module.exports = router;
