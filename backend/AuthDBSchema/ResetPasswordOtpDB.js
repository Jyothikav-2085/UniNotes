import connection from '../db.js';

const createResetPasswordOtpTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS password_reset_otps (
      Reset_OTP_id INT AUTO_INCREMENT PRIMARY KEY,
      Reset_OTP_email VARCHAR(100) NOT NULL,
      Reset_otp VARCHAR(6) NOT NULL,
      Reset_OTP_expiresAt DATETIME NOT NULL,
      Reset_OTP_verified BOOLEAN DEFAULT FALSE,
      Reset_OTP_createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  connection.query(createTableQuery, (err, results) => {
    if (err) {
      console.error('Error creating password_reset_otps table:', err);
    } else {
      console.log('password_reset_otps table created.');
    }
  });
};

export default createResetPasswordOtpTable;
