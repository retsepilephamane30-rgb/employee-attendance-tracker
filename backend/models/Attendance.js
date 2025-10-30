const db = require('../config/database');

class Attendance {
  static getAll(callback) {
    const query = `SELECT * FROM attendance ORDER BY date DESC, created_at DESC`;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Database error in getAll:', err.message);
        callback(err, null);
      } else {
        callback(null, results);
      }
    });
  }

  static create(attendanceData, callback) {
    const { employeeName, employeeID, date, status } = attendanceData;
    const query = `INSERT INTO attendance (employeeName, employeeID, date, status) VALUES (?, ?, ?, ?)`;
    
    db.query(query, [employeeName, employeeID, date, status], (err, results) => {
      if (err) {
        console.error('Database error in create:', err.message);
        callback(err, null);
      } else {
        callback(null, { id: results.insertId, ...attendanceData });
      }
    });
  }

  static delete(id, callback) {
    const query = `DELETE FROM attendance WHERE id = ?`;
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error('Database error in delete:', err.message);
        callback(err, null);
      } else {
        callback(null, results.affectedRows);
      }
    });
  }

  static searchByNameOrID(searchTerm, callback) {
    const query = `SELECT * FROM attendance WHERE employeeName LIKE ? OR employeeID LIKE ? ORDER BY date DESC`;
    db.query(query, [`%${searchTerm}%`, `%${searchTerm}%`], (err, results) => {
      if (err) {
        console.error('Database error in search:', err.message);
        callback(err, null);
      } else {
        callback(null, results);
      }
    });
  }

  static filterByDate(date, callback) {
    const query = `SELECT * FROM attendance WHERE date = ? ORDER BY created_at DESC`;
    db.query(query, [date], (err, results) => {
      if (err) {
        console.error('Database error in filter:', err.message);
        callback(err, null);
      } else {
        callback(null, results);
      }
    });
  }
}

module.exports = Attendance;