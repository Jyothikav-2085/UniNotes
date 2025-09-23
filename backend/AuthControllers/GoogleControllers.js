// AuthControllers/googlecontrollers.js

export const googleController = (req, res, connection) => {
  const { name, email, google_id, avatar } = req.body;

  // Insert into signup table (use google_id as password placeholder)
  const signupQuery = 'INSERT INTO signup (name, email, password) VALUES (?, ?, ?)';
  connection.query(signupQuery, [name, email, google_id], (signupErr) => {
    if (signupErr && signupErr.code !== 'ER_DUP_ENTRY') {
      return res.status(500).json({ error: 'Signup DB error', details: signupErr });
    }
    // Insert into login table with correct column names
    const loginQuery = 'INSERT INTO login (login_email, login_password) VALUES (?, ?)';
    connection.query(loginQuery, [email, google_id], (loginErr) => {
      if (loginErr && loginErr.code !== 'ER_DUP_ENTRY') {
        return res.status(500).json({ error: 'Login DB error', details: loginErr });
      }
      return res.status(201).json({ message: 'Google user saved to both tables' });
    });
  });
};
