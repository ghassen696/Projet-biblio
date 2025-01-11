import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendVerificationEmail, sendQRCodeEmail } from './biblio/src/utils/email.mjs';
import { generateQRCode } from './biblio/src/utils/qrcode.mjs';
import usersRouter from './routes/users.mjs'; // Import the Users router

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3039', // Adjust this to match your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Connect to MongoDB
mongoose.connect('mongodb://localhost/biblio', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Registration Route
app.post('/api/register', async (req, res) => {
    console.log('Request body:', req.body); // Log the request body
    const { username, email, password, role } = req.body;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(ucar|u-manouba|utm)\.tn$/;
  
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email); // Log invalid email format
      return res.status(400).json({ message: 'Invalid email format' });
    }
  
    try {
      const { default: User } = await import('./models/user.mjs');
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log('Email already in use:', email); // Log email already in use
        return res.status(400).json({ message: 'Email already in use' });
      }
  
      const newUser = new User({ username, email, password, role: role || 'user', isVerified: false });
      await newUser.save();
  
      const token = jwt.sign({ userId: newUser._id }, 'your_jwt_secret', { expiresIn: '1h' });
      await sendVerificationEmail(email, token);
  
      console.log('User registered and verification email sent:', newUser); // Log user registration
      res.status(201).json({ message: 'User registered. Please check your email to verify your account.' });
    } catch (error) {
      console.error('Error registering user:', error); // Log the error
      res.status(500).json({ message: `Error registering user: ${error.message}` });
    }
  });

// Email Verification Route
app.get('/api/verify-email', async (req, res) => {
    const { token } = req.query;
  
    try {
      const decoded = jwt.verify(token, 'your_jwt_secret');
      const { default: User } = await import('./models/user.mjs');
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(400).json({ message: 'Invalid token' });
      }
  
      user.isVerified = true;
      await user.save();
  
      await generateQRCode();
      await sendQRCodeEmail(user.email);
  
      res.send('Email verified. A QR code has been sent to your email.');
    } catch (error) {
      console.error('Error verifying email:', error);
      res.status(500).json({ message: 'Error verifying email' });
    }
  });

// Simplified Login Route with Redirection
app.post('/api/login', async (req, res) => {
    console.log('Login request body:', req.body); // Log the request body
    const { email, password } = req.body;

    try {
        const { default: User } = await import('./models/user.mjs');
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found:', email); // Log user not found
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (password !== user.password) {
            console.log('Password mismatch for user:', email); // Log password mismatch
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (!user.isVerified) {
            return res.status(401).json({ message: 'Please verify your email before logging in.' });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
        console.log('User logged in:', user.email); // Log user login

        // Redirect to home page
        const redirectUrl = 'http://localhost:3039/';

        res.json({ token, role: user.role, redirectUrl });
    } catch (error) {
        console.error('Error logging in:', error); // Log the error
        res.status(500).json({ message: `Error logging in: ${error.message}` });
    }
});

// Middleware to Check Role
const auth = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        const { default: User } = await import('./models/user.mjs');
        const user = await User.findById(decoded.userId);
        if (!user) throw new Error();
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Please authenticate' });
    }
};

const admin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};

// Protected Routes
app.get('/api/dashboard', auth, admin, (req, res) => {
    res.send('Welcome to the admin dashboard');
});

app.get('/api/user', auth, admin, (req, res) => {
    res.send('Welcome to the user management page');
});

app.get('/api/resources', auth, (req, res) => {
    res.send('Welcome to the resources page');
});

// Routes
app.use('/api/users', usersRouter);

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));