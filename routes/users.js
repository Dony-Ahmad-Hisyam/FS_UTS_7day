const bcrypt = require('bcrypt');
const express = require("express");
const modelUser = require("../model/modelUser");
const router = express.Router();

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
    let Data = await modelUser.getAll();
    res.render("users/index", {
      data: Data,
      userEmail: userEmail,
    });
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
    res.redirect("/users");
  }
});

router.get("/edit/:id", async function (req, res, next) {
  let userEmail = req.userEmail;
  try {
    let id = req.params.id;
    let rows = await modelUser.getId(id);
    res.render("users/edit", {
      id: rows[0].id_users,
      userEmail: userEmail,
      email: rows[0].email,
      // Tidak lagi menyertakan password dalam data yang dikirimkan ke HTML
    });
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
    res.redirect("/users");
  }
});

router.post("/update/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let { email, password } = req.body;
    let hashedPassword = await bcrypt.hash(password, 10); // Menghash password sebelum disimpan
    let data = {
      email: email,
      password: hashedPassword, // Menggunakan password yang sudah dihash
    };
    await modelUser.Update(id, data);
    req.flash("success", "Berhasil memperbarui data");
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
  }
  res.redirect("/users");
});

router.get("/delete/:id", async function (req, res) {
  try {
    let id = req.params.id;
    await modelUser.Delete(id);
    req.flash("success", "Berhasil menghapus data");
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
  }
  res.redirect("/users");
});

module.exports = router;
