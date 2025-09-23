export const signupController = (req, res, connection) => {
  const { name, email, password } = req.body;

  console.log("Signup Received body:", req.body);

  if (!name || name.length < 3) {
    return res.status(400).json({ error: 'Name must be at least 3 characters long.' });
  }

  if (!email || ! /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  // Check if email is lowercase only
  if (email !== email.toLowerCase()) {
    return res.status(400).json({ error: 'Invalid email format (email must be lowercase)' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  // Insert user into the database
  const insertQuery = 'INSERT INTO signup (name, email, password) VALUES (?, ?, ?)';

  connection.query(insertQuery, [name, email, password], (err, results) => {
    if (err) {
      console.error('Error inserting signup data:', err);

      let customMessage = 'Database error occurred. Please try again.';

      if (err.code === 'ER_DUP_ENTRY') {
        customMessage = 'Email already exists.';
      } else if (err.code === 'ER_BAD_NULL_ERROR') {
        customMessage = 'Please fill in all required fields.';
      }
      return res.status(500).json({ error: customMessage });
    }

      res.status(201).json({ message: 'User signed up successfully', userId: results.insertId });
    });
};
