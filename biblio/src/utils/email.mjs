import sgMail from '@sendgrid/mail';
import fs from 'fs';

sgMail.setApiKey('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');

export const sendVerificationEmail = (email, token) => {
  const verificationLink = `http://localhost:5000/api/verify-email?token=${token}`;
  const msg = {
    to: email,
    from: 'firass.khlifa@gmail.com',
    subject: 'Email Verification',
    text: `Please verify your email by clicking the following link: ${verificationLink}`,
  };

  return sgMail.send(msg);
};

export const sendQRCodeEmail = (email) => {
  const qrCodeImage = fs.readFileSync('qrcode.png');
  const msg = {
    to: email,
    from: 'firass.khlifa@gmail.com',
    subject: 'Your QR Code',
    html: `<p>Here is your QR code:</p><img src="cid:qrcode" alt="QR Code" />`,
    attachments: [
      {
        content: qrCodeImage.toString('base64'),
        filename: 'qrcode.png',
        type: 'image/png',
        disposition: 'inline',
        content_id: 'qrcode'
      }
    ]
  };

  return sgMail.send(msg);
};