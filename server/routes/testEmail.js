import express from "express";
import { sendWelcomeEmail } from "../utils/mailer.js";

const router = express.Router();

router.get("/test-mail", async (req, res) => {
  try {
    await sendWelcomeEmail("singhjaiveer1005@gmail.com");
    res.json({ message: "Mail sent!" });
  } catch (err) {
    console.error("Mail Error:", err);
    res.status(500).json({ error: "Mail failed to send" });
  }
});

export default router;
