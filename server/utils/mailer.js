import nodemailer from 'nodemailer';
import dotenvx from '@dotenvx/dotenvx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenvx.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cache the HTML template to avoid reading file every time
let htmlTemplate = null;

const getHtmlTemplate = () => {
  if (!htmlTemplate) {
    try {
      htmlTemplate = fs.readFileSync(
        path.join(__dirname, '../templates/mail.html'), 
        "utf-8"
      );
      console.log("📧 Email template loaded and cached");
    } catch (error) {
      console.error("❌ Failed to load email template:", error);
      throw new Error("Email template not found");
    }
  }
  return htmlTemplate;
};

// Preload template at startup
if (process.env.NODE_ENV !== 'test') {
  getHtmlTemplate();
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  // Connection pooling options
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  rateLimit: 14, // 14 emails per second max
});


export const sendWelcomeEmail = async (toEmail) => {
  try {
    const htmlTemplate = getHtmlTemplate();

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