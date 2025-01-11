import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

export const generateQRCode = async () => {
  try {
    const randomString = uuidv4(); // Generate a random UUID
    const qrCodeDataURL = await QRCode.toDataURL(randomString);
    const base64Data = qrCodeDataURL.replace(/^data:image\/png;base64,/, '');

    // Save the QR code as an image file
    fs.writeFileSync('qrcode.png', base64Data, 'base64');
    console.log('QR code generated and saved as qrcode.png');
    return qrCodeDataURL;
  } catch (err) {
    console.error('Error generating QR code:', err);
    throw err;
  }
};