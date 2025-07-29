import mongoose from 'mongoose';

const emailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    index: true,  
  },
});

// Single index definition with unique constraint
emailSchema.index({ email: 1 }, { unique: true });

export default mongoose.model("Email", emailSchema); 