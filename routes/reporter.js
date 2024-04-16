const express = require("express");
const router = express.Router();
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

router.get("/", async function (req, res, next) {
  try {
    let userEmail = req.userEmail;
    let rows = await ReporterModal.getAll();
    res.render("reporter/index", {
      data: rows,
      userEmail: userEmail,
    });
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
    res.redirect("/reporter");
  }
});

router.get("/create", function (req, res, next) {
  let userEmail = req.userEmail;
  res.render("reporter/create", {
    nama: "",
    userEmail: userEmail,
    email: "",
    alamat: "",
  });
});

router.post("/store", async function (req, res, next) {
  try {
    let { nama, email, alamat } = req.body;
    let data = {
      nama: nama,
      email: email,
      alamat: alamat,
    };
    await ReporterModal.store(data);
    req.flash("success", "Berhasil menyimpan data");
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
  }
  res.redirect("/reporter");
});

router.get("/edit/:id", async function (req, res, next) {
  let userEmail = req.userEmail;
  try {
    let id = req.params.id;
    let rows = await ReporterModal.getById(id);
    res.render("reporter/edit", {
      id: rows[0].reporter_id,
      userEmail: userEmail,
      nama: rows[0].nama,
      email: rows[0].email,
      alamat: rows[0].alamat,
    });
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
    res.redirect("/reporter");
  }
});

router.post("/update/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let { nama, email, alamat } = req.body;
    let data = {
      nama: nama,
      email: email,
      alamat: alamat,
    };
    await ReporterModal.update(id, data);
    req.flash("success", "Berhasil memperbarui data");
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
  }
  res.redirect("/reporter");
});

router.get("/delete/:id", async function (req, res) {
  try {
    let id = req.params.id;
    await ReporterModal.delete(id);
    req.flash("success", "Berhasil menghapus data");
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
  }
  res.redirect("/reporter");
});

module.exports = router;
