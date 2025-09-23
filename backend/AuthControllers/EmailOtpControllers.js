import connection from '../db.js';


// creating a function to get the OTP and its expiration time from the database
export function EmailOtpController(email) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT otp, OTP_expiresAt
      FROM email_otps
      WHERE OTP_email = ?
      ORDER BY OTP_expiresAt DESC
      LIMIT 1
    `;
    connection.query(query, [email], (err, results) => {
      if (err) {
        return reject(err);
      }
      if (results.length === 0) {
        resolve(null);
      } else {
        resolve(results[0]);
      }
    });
  });
}


// to mark the OTP as verified in the database
export function markOtpVerified(email) {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE email_otps
      SET OTP_verified = TRUE
      WHERE OTP_email = ?
      ORDER BY OTP_expiresAt DESC
      LIMIT 1
    `;
    connection.query(query, [email], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}