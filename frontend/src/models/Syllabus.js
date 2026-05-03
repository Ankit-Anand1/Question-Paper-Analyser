import mongoose from "mongoose";

const SyllabusSchema = new mongoose.Schema({
  subject: String,
  content: String, // Full extracted text
  topics: [String], // Array of topic names
}, { timestamps: true });

export default mongoose.models.Syllabus || mongoose.model("Syllabus", SyllabusSchema);
