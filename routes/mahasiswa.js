const express = require("express");
const router = express.Router();
const MahasiswaModal = require("../model/mahasiswaModal.js");
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

router.get("/", async function (req, res, next) {
  try {
    let userEmail = req.userEmail;
    let rows = await MahasiswaModal.getAll();
    res.render("mahasiswa/index", {
      data: rows,
      userEmail: userEmail,
    });
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
    res.redirect("/mahasiswa");
  }
});

router.get("/create", function (req, res, next) {
  let userEmail = req.userEmail;
  res.render("mahasiswa/create", {
    nama: "",
    userEmail: userEmail,
    nim: "",
    jurusan: "",
  });
});

router.post("/store", async function (req, res, next) {
  try {
    let { nama, nim, jurusan } = req.body;
    let data = {
      nama: nama,
      nim: nim,
      jurusan: jurusan,
    };
    await MahasiswaModal.store(data);
    req.flash("success", "Berhasil menyimpan data");
    res.redirect("/mahasiswa");
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
    res.redirect("/mahasiswa");
  }
});

router.get("/edit/:id", async function (req, res, next) {
  try {
    let userEmail = req.userEmail;
    let id = req.params.id;
    let rows = await MahasiswaModal.getById(id);
    res.render("mahasiswa/edit", {
      id: rows[0].mahasiswa_id,
      nama: rows[0].nama,
      nim: rows[0].nim,
      userEmail: userEmail,
      jurusan: rows[0].jurusan,
    });
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
    res.redirect("/mahasiswa");
  }
});

router.post("/update/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let { nama, nim, jurusan } = req.body;
    let data = {
      nama: nama,
      nim: nim,
      jurusan: jurusan,
    };
    await MahasiswaModal.update(id, data);
    req.flash("success", "Berhasil memperbarui data");
    res.redirect("/mahasiswa");
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
    res.redirect("/mahasiswa");
  }
});

router.get("/delete/:id", async function (req, res) {
  try {
    let id = req.params.id;
    await MahasiswaModal.delete(id);
    req.flash("success", "Berhasil menghapus data");
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
  }
  res.redirect("/mahasiswa");
});

module.exports = router;
