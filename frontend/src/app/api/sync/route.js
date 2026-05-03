import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Question from "@/models/Question";
import Syllabus from "@/models/Syllabus";

export async function GET() {
  try {
    await connectDB();

    const questions = await Question.find().sort({ frequency: -1 });
    const syllabus = await Syllabus.findOne();
    
    // Convert DB syllabus format back to UI topics format
    const topics = (syllabus?.topics || []).map(t => ({
      id: Math.random().toString(36).substr(2, 9),
      name: t,
      subject: syllabus?.subject || "General",
      frequency: Math.floor(Math.random() * 5) + 1, // Fallback if frequency not stored
      priority: "high",
      priorityScore: 80,
      module: "Analysis Result"
    }));

    return NextResponse.json({
      success: true,
      questions,
      topics,
      recommendations: syllabus?.content || "No strategy generated yet."
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
