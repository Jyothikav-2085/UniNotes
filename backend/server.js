import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import connection from './db.js'; // Import the database connection

import createSignUpTable from './AuthDBSchema/SignUpDB.js'; // Import the function to create the SignUp table
import { signupController } from './AuthControllers/SignUpControllers.js'; // Import the signup controller

import createLogInTable from './AuthDBSchema/LogInDB.js'; // Import the function to create the LogIn table
import { loginController } from './AuthControllers/LogInControllers.js'; // Import the login controller

import createEmailOtpTable from './AuthDBSchema/EmailOtpDB.js'; // Import the function to create the Email OTP table
import createResetPasswordOtpTable from './AuthDBSchema/ResetPasswordOtpDB.js';// Import the fuctions to create the password reset otp table
import otpRoutes from './Routes/OtpRoutes.js'; // Import OTP routes

import { googleController } from './AuthControllers/GoogleControllers.js'; // Import the Google controller




dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json()) ;
app.use(express.urlencoded({ extended: true }));

// Create the SignUp table if it doesn't exist
createSignUpTable();
// Define the /signup endpoint
app.post('/signup', (req, res) => {
  signupController(req, res, connection);
});

// Create the LogIn table if it doesn't exist
createLogInTable();
// Define the /login endpoint
app.post('/login', (req, res) => {
  loginController(req, res, connection);
});

// Create the Email OTP table if it doesn't exist
createEmailOtpTable();
// Create the Password Reset Table if it doesn't exist
createResetPasswordOtpTable();
// Use the OTP routes
app.use('/otp', otpRoutes);


// Define the /google endpoint
app.post('/google', (req, res) => {
  googleController(req, res, connection);
});














// Test the database connection
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database!');
});

// Define a simple route to test the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

