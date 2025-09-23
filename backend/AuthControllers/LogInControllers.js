// loginController.js
export const loginController = (req, res, dbConnection) => {

  const { loginEmail, loginPassword } = req.body;

  console.log("Login request body:", req.body);
  

  // Basic validation
  if (!loginEmail || !/\S+@\S+\.\S+/.test(loginEmail)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }
  if (!loginPassword || loginPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }
  const query = 'SELECT * FROM login WHERE login_email = ? AND login_password = ? LIMIT 1';
  dbConnection.query(query, [loginEmail, loginPassword], (err, results) => {
    if (err) {
      console.error('Login query error:', err);
      return res.status(500).json({ error: 'Database error occurred. Please try again.' });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const loginId = results[0].login_id;
    const updateLastLogin = 'UPDATE login SET last_login = CURRENT_TIMESTAMP WHERE login_id = ?';
    dbConnection.query(updateLastLogin, [loginId], (updateErr) => {
      if (updateErr) {
        console.error('Error updating last_login:', updateErr);
      }
      res.status(200).json({ message: 'Login successful', loginId });
    });
  });
};



/* all the error messages written above like
 user login successful are seen in postman 
 ,not in react server */