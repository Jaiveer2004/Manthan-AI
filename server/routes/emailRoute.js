import express from 'express';
import rateLimit from 'express-rate-limit';
import Email from '../models/Email.js';
import { sendWelcomeEmail } from '../utils/mailer.js';

const router = express.Router();

const subscribeLimit = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: {
    error: "Too many subscription attempts. Please try again in 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/subscribe', subscribeLimit, async (request, response) => {
  const startTime = Date.now();
  
  try {
    const { email } = request.body;

    // Enhanced validation
    if (!email) {
      return response.status(400).json({ error: "Email is required." });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return response.status(400).json({ error: "Invalid email format." });
    }

    // Check for existing email with case-insensitive search
    const existing = await Email.findOne({ email: email.toLowerCase() });
    if (existing) {
      return response.status(409).json({ message: "You have already subscribed." });
    }
    const newEmail = new Email({ email: email.toLowerCase() });
    await newEmail.save();

    // Send email asynchronously without blocking the response
    sendWelcomeEmail(email).then(() => {
      console.log("✅ Email sent to:", email);
    }).catch((err) => {
      console.error("❌ Failed to send email to:", email, err);
    });

    const processingTime = Date.now() - startTime;
    response.setHeader('X-Response-Time', `${processingTime}ms`);
    response.status(201).json({ message: "Subscribed Successfully" });
  } catch (err) {
    console.error("Subscription error:", err);
    response.status(500).json({ error: "Server Error" });
  }
});

export default router;