import connection from '../db.js';

const createEmailOtpTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS email_otps (
      OTP_id INT AUTO_INCREMENT PRIMARY KEY,
      OTP_email VARCHAR(100) NOT NULL,
      otp VARCHAR(6) NOT NULL,
      OTP_expiresAt DATETIME NOT NULL,
      OTP_verified BOOLEAN DEFAULT FALSE,
      OTP_createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  connection.query(createTableQuery, (err, results) => {
    if (err) {
      console.error('Error creating email_otps table:', err);
    } else {
      console.log('email_otps table created.');
    }
  });
};

export default createEmailOtpTable;
