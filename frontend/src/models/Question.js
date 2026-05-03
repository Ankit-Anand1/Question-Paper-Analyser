import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  text: String,
  topic: String,
  year: Number,
  subject: String,
  frequency: { type: Number, default: 1 },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' }
});

export default mongoose.models.Question || mongoose.model("Question", QuestionSchema);
