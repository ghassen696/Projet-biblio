import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }, // Default role is 'user'
  isVerified: { type: Boolean, default: false }, // Email verification status
  qrCode: { type: String }, // QR code data
  qrCodeExpiry: { type: Date } // QR code expiry date
});

const User = mongoose.model('User', userSchema);
export default User;