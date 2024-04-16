const express = require("express");
const router = express.Router();
const Mahasiswa = require("../model/mahasiswaModal");

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/registerMahasiswa", function (req, res, next) {
  res.render("auth/registerMahasiswa");
});

router.get("/loginMahasiswa", function (req, res, next) {
  res.render("auth/loginMahasiswa");
});

router.post("/savemahasiswa", async (req, res) => {
  const { nama, nim, jurusan } = req.body;
  if (!nama || !nim) {
    req.flash("error", "Nama dan NIM harus diisi");
    return res.redirect("/registerMahasiswa");
  }
  try {
    const data = { nama, nim, jurusan };
    await Mahasiswa.store(data);
    req.flash("success", "Berhasil Registrasi");
    res.redirect("/loginMahasiswa");
  } catch (err) {
    console.error(err);
    req.flash("error", "Gagal melakukan registrasi");
    res.redirect("/registerMahasiswa");
  }
});

router.post("/loginMahasiswa", async (req, res) => {
  const { nama, nim } = req.body;
  if (!nama || !nim) {
    req.flash("error", "Nama dan NIM harus diisi");
    return res.redirect("/loginMahasiswa");
  }
  try {
    const data = await Mahasiswa.Login(nama, nim);
    req.session.mahasiswaId = data[0].mahasiswa_id;
    if (data.length > 0) {
      req.session.namaId = data[0].nama;
      req.flash("success", "Berhasil login");
      return res.redirect("/");
    }
    req.flash("error", "Akun tidak ditemukan");
    res.redirect("/loginMahasiswa");
  } catch (err) {
    console.error(err);
    req.flash("error", "Terjadi kesalahan saat login");
    res.redirect("/loginMahasiswa");
  }
});

router.get("/logoutMahasiswa", function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.error(err);
    }
    res.redirect("/loginMahasiswa");
  });
});

module.exports = router;
