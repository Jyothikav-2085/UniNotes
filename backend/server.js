import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import supabase from './db.js';

import createSignUpTable from './AuthDBSchema/SignUpDB.js'; // Import the function to create the SignUp table
import { signupController } from './AuthControllers/SignUpControllers.js'; // Import the signup controller

import createLogInTable from './AuthDBSchema/LogInDB.js'; // Import the function to create the LogIn table
import { loginController } from './AuthControllers/LogInControllers.js'; // Import the login controller

import createEmailOtpTable from './AuthDBSchema/EmailOtpDB.js'; // Import the function to create the Email OTP table
import createResetPasswordOtpTable from './AuthDBSchema/ResetPasswordOtpDB.js'; // Import the function to create the password reset otp table
import otpRoutes from './Routes/OtpRoutes.js'; // Import OTP routes

import createNotesInfoTable  from './NoteDBSchema/NotesDB.js'; //Import the function to create the notes_ino table
import notesRoutes from './Routes/NoteRoutes.js'; // Import Notes routes

import { googleController } from './AuthControllers/GoogleControllers.js'; // Import the Google controller


dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define endpoints and routes
app.post('/signup', (req, res) => {
  signupController(req, res, supabase);
});

app.post('/login', (req, res) => {
  loginController(req, res, supabase);
});

app.use('/otp', otpRoutes);
app.use('/notes', notesRoutes);  

app.post('/google', (req, res) => {
  googleController(req, res, supabase);
});



// Check Supabase connection on startup
const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('signup').select('id').limit(1);
    if (error) {
      console.log('Error connecting to Supabase:', error);
    } else {
      console.log('Connected to Supabase database successfully!');
    }
  } catch (err) {
    console.log('Unexpected error checking Supabase connection:', err);
  }
};

// Immediately Invoked Async Function to create tables then start server and check DB connection
(async () => {
  try {
    await createSignUpTable();
    await createLogInTable();
    await createEmailOtpTable();
    await createResetPasswordOtpTable();
    await createNotesInfoTable(); 

    const PORT = process.env.BACKEND_PORT || 5001;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    await checkSupabaseConnection();
  } catch (err) {
    console.log('Error during startup:', err);
  }
})();
