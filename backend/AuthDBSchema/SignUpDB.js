import connection from '../db.js'; 

const createSignUpTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS signup (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  connection.query(createTableQuery, (err, results) => {
    if (err) {
      console.error('Error creating signup table:', err);
    } else {
      console.log('SignUp Table created.');
    }
  });
};

export default createSignUpTable;
