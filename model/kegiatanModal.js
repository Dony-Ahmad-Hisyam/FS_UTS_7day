const connection = require("../database/database");

class KegiatanModal {
  static async getAll() {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM kegiatan ORDER BY kegiatan_id DESC",
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
      connection.query("INSERT INTO kegiatan SET ?", data, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static async getById(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM kegiatan WHERE kegiatan_id = ?",
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
        "UPDATE kegiatan SET ? WHERE kegiatan_id = ?",
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
        "DELETE FROM kegiatan WHERE kegiatan_id = ?",
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

module.exports = KegiatanModal;
