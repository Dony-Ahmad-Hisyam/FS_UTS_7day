var express = require("express");
const BeritaModal = require("../model/beritaModal");
const KegiatanModal = require("../model/kegiatanModal");
const MahasiswaModal = require("../model/mahasiswaModal");
const kegiatanMahasiswaModal = require("../model/kegiatanMahasiswaModal");
var router = express.Router();

router.use(async function (req, res, next) {
  try {
    // Periksa apakah pengguna sudah login sebagai mahasiswa
    if (req.session.mahasiswaId) {
      let userData = await MahasiswaModal.getById(req.session.mahasiswaId);
      if (userData.length > 0) {
        req.userNama = userData[0].nama;
        req.nim = userData[0].nim;
        req.mahasiswa_id = userData[0].mahasiswa_id;
      } else {
        return res.redirect("/logout");
      }
    }
  } catch (error) {
    // Tangani kesalahan
    req.flash("error", error.message || "Terjadi kesalahan pada server");
    return res.redirect("/logout");
  }
  // Lanjutkan ke middleware atau rute selanjutnya
  next();
});

router.get("/", async function (req, res, next) {
  try {
    let rows = await BeritaModal.getAll();
    let item = await KegiatanModal.getAll();
    let userNama = req.userNama || "";
    let mahasiswa_id = req.mahasiswa_id || "";
    let data_kegiatan_ikuti = await kegiatanMahasiswaModal.getAll();
    res.render("dashboard/index", {
      data: rows,
      dataKegiatan: item,
      userNama: userNama,
      mahasiswa_id: mahasiswa_id,
      data_kegiatan_ikuti: data_kegiatan_ikuti,
    });
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
    res.redirect("/");
  }
});

router.post("/ikutiProgram", async function (req, res) {
  let { mahasiswa_id, kegiatan_id } = req.body;
  let data = {
    mahasiswa_id: mahasiswa_id,
    kegiatan_id: kegiatan_id,
  };
  try {
    await kegiatanMahasiswaModal.store(data);
    req.flash("success", "Berhasil mengikuti program");
    res.redirect("/#kegiatan_ikuti");
  } catch (error) {
    console.error("Gagal mengikuti program:", error);
    req.flash("error", error.message || "Terjadi kesalahan pada server");
    res.redirect("/");
  }
});

module.exports = router;
