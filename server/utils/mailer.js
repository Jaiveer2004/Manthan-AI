import nodemailer from 'nodemailer';
import dotenvx from '@dotenvx/dotenvx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenvx.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


export const sendWelcomeEmail = async (toEmail) => {
  try {
    
    const htmlTemplate = fs.readFileSync(
      path.join(__dirname, '../templates/mail.html'), 
      "utf-8"
    );

    await transporter.sendMail({
      from: `"Team Manthan" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Welcome to Manthan 🧠",
      html: htmlTemplate,
    });

    console.log(`Email sent to ${toEmail}`);
  } catch (err) {
    console.log("Failed to send email: ", err);
  }
};