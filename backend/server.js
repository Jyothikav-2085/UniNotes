import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import supabase from './db.js'; // Import Supabase client

import createSignUpTable from './AuthDBSchema/SignUpDB.js'; // Import the function to create the SignUp table
import { signupController } from './AuthControllers/SignUpControllers.js'; // Import the signup controller

import createLogInTable from './AuthDBSchema/LogInDB.js'; // Import the function to create the LogIn table
import { loginController } from './AuthControllers/LogInControllers.js'; // Import the login controller

import createEmailOtpTable from './AuthDBSchema/EmailOtpDB.js'; // Import the function to create the Email OTP table
import createResetPasswordOtpTable from './AuthDBSchema/ResetPasswordOtpDB.js'; // Import the function to create the password reset otp table
import otpRoutes from './Routes/OtpRoutes.js'; // Import OTP routes

import createNotesInfoTable  from './NoteDBSchema/NotesDB.js'; //Import the function to create the notes_ino table
import createLikesTable from './NoteDBSchema/LikesDB.js'; // Import the function to create the likes table
import notesRoutes from './Routes/NoteRoutes.js'; // Import Notes routes

import { googleController } from './AuthControllers/GoogleControllers.js'; // Import the Google controller

import profileRoutes from './Routes/ProfileRoutes.js'; // Import Profile routes
import aiRoutes from './Routes/AIRoutes.js'; // Import AI routes


dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define endpoints and routes
app.post('/signup', signupController);

app.post('/login', loginController);

app.use('/otp', otpRoutes);
app.use('/notes', notesRoutes);  
app.use('/profile', profileRoutes); // Add profile routes
app.use('/ai', aiRoutes); // Add AI routes

app.post('/google', googleController);

// Check database connection on startup
const checkDatabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('signup')
      .select('id')
      .limit(1);

    if (error) {
      console.log('Error connecting to Supabase database:', error);
    } else {
      console.log('Connected to Supabase database successfully!');
    }
  } catch (err) {
    console.log('Error connecting to Supabase database:', err);
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
    await createLikesTable(); // Create likes table

    const PORT = process.env.BACKEND_PORT || 5001;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    await checkDatabaseConnection();
  } catch (err) {
    console.log('Error during startup:', err);
  }
})();