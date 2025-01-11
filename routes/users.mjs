import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, role } = req.body;
  const { default: User } = await import('../models/user.mjs');
  const qrCode = generateQRCode(); // Implement QR code generation logic
  const qrCodeExpiry = role === 'student' ? new Date(Date.now() + 365*24*60*60*1000) : new Date(Date.now() + 24*60*60*1000);

  const newUser = new User({ email, password, qrCode, qrCodeExpiry, role });
  newUser.save()
    .then(user => res.json(user))
    .catch(err => res.status(400).json(err));
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { default: User } = await import('../models/user.mjs');
  User.findOne({ email })
    .then(user => {
      if (!user) return res.status(404).json({ message: 'User not found' });

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          const payload = { id: user.id, email: user.email, role: user.role };
          jwt.sign(payload, 'your_jwt_secret', { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ success: true, token: 'Bearer ' + token });
          });
        } else {
          res.status(400).json({ message: 'Incorrect password' });
        }
      });
    })
    .catch(err => res.status(400).json(err));
});

export default router;