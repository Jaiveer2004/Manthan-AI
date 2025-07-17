import express from 'express';
import Email from '../models/Email.js';
import { sendWelcomeEmail } from '../utils/mailer.js';

const router = express.Router();

router.post('/subscribe', async (request, response) => {
  try {
    const { email } = request.body;

    if (!email) {
      return response.status(404).json({ error: "Email is required." });
    }

    const existing = await Email.findOne({ email });
    if (existing) {
      return response.status(409).json({ message: "You have already subscribed." });
    }
    const newEmail = new Email({ email });
    await newEmail.save();

    console.log("📩 Email to send:", email);
    await sendWelcomeEmail(email);
    console.log("✅ Email sent to:", email);

    response.status(201).json({ message: "Subscribed Successfully" });
  } catch (err) {
    response.status(500).json({ error: "Server Error" });
  }
});

export default router;