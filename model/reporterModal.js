const connection = require("../database/database");

class ReporterModal {
  static async getAll() {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM reporter ORDER BY reporter_id DESC",
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
      connection.query("INSERT INTO reporter SET ?", data, (err, result) => {
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
        "SELECT * FROM reporter WHERE reporter_id = ?",
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
        "UPDATE reporter SET ? WHERE reporter_id = ?",
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
        "DELETE FROM reporter WHERE reporter_id = ?",
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

module.exports = ReporterModal;
