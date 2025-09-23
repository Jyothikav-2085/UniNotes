import connection from '../db.js'; 

const createLogInTable = () => {
  const createTableQuery = `
   CREATE TABLE IF NOT EXISTS login (
  login_id INT AUTO_INCREMENT PRIMARY KEY,
  login_email VARCHAR(100) NOT NULL UNIQUE,
  login_password VARCHAR(255) NOT NULL,
  last_login TIMESTAMP NULL DEFAULT NULL,
  created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
  `;

  connection.query(createTableQuery, (err, results) => {
    if (err) {
      console.error('Error creating login table:', err);
    } else {
      console.log('LogIn Table created.');
    }
  });
};

export default createLogInTable;