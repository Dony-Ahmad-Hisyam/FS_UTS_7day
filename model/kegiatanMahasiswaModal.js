const connection = require("../database/database");

class kegiatanMahasiswaModal {
  static async getAll() {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT *, b.nama AS nama_mahasiswa, c.nama AS nama_kegiatan FROM kegiatan_mahasiswa a LEFT JOIN mahasiswa b ON b.mahasiswa_id = a.mahasiswa_id LEFT JOIN kegiatan c ON c.kegiatan_id = a.kegiatan_id ORDER BY a.kegiatan_mahasiswa_id DESC",
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }
  static async store(data) {
    return new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO kegiatan_mahasiswa SET ?",
        data,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }

  static async getById(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM kegiatan_mahasiswa WHERE kegiatan_mahasiswa_id = ?",
        id,
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  static async update(id, data) {
    return new Promise((resolve, reject) => {
      connection.query(
        "UPDATE kegiatan_mahasiswa SET ? WHERE kegiatan_mahasiswa_id = ?",
        [data, id],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }

  static async delete(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM kegiatan_mahasiswa WHERE kegiatan_mahasiswa_id = ?",
        id,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }
}

module.exports = kegiatanMahasiswaModal;
