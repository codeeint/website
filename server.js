const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Titan Email SMTP Configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.titan.email',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || 'team@codeeint.com',
    pass: process.env.EMAIL_PASS // Your Titan App Password
  }
});

// Endpoint for Schools OTP
app.post('/api/send-otp', async (req, res) => {
  const { user_email, user_name, otp_code, request_type } = req.body;

  const mailOptions = {
    from: '"Codeeint Team" <team@codeeint.com>',
    to: user_email,
    subject: `Verification Code: ${otp_code}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2>Hello ${user_name},</h2>
        <p>Thank you for your interest in the Codeeint ${request_type}.</p>
        <p>Your verification code is:</p>
        <div style="font-size: 32px; font-weight: bold; color: #f97316; margin: 20px 0;">${otp_code}</div>
        <p>Please enter this code on the website to continue.</p>
        <hr>
        <p style="font-size: 12px; color: #666;">This is an automated message from Codeeint Technologies.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Titan SMTP Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint for Final Enquiries
app.post('/api/submit-enquiry', async (req, res) => {
  const data = req.body;

  const mailOptions = {
    from: '"Website Lead" <team@codeeint.com>',
    to: 'team@codeeint.com',
    subject: `New Lead: ${data.request_type || 'General Enquiry'}`,
    html: `
      <h2>New Institutional Enquiry</h2>
      <table border="1" cellpadding="10" style="border-collapse: collapse;">
        ${Object.entries(data).map(([key, val]) => `
          <tr>
            <td style="background: #f4f4f4; font-weight: bold;">${key.replace('_', ' ').toUpperCase()}</td>
            <td>${val}</td>
          </tr>
        `).join('')}
      </table>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Titan SMTP Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Codeeint Backend running on port ${PORT}`));
