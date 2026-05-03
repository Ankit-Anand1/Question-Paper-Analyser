import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Question from "@/models/Question";
import Syllabus from "@/models/Syllabus";

// Standardized GET handler for session data
export async function GET(req) {
  try {
    await connectDB();
    const questions = await Question.find({}).sort({ frequency: -1 });
    const syllabus = await Syllabus.findOne({});
    
    const topicCount = {};
    questions.forEach(q => {
      topicCount[q.topic] = (topicCount[q.topic] || 0) + 1;
    });

    const topicsArray = Object.entries(topicCount).map(([name, count]) => ({
      id: name,
      name,
      subject: questions.find(q => q.topic === name)?.subject || 'General',
      frequency: count,
      priority: count >= 3 ? 'high' : count === 2 ? 'medium' : 'low',
      priorityScore: Math.min(100, count * 15 + 20)
    })).sort((a,b) => b.frequency - a.frequency);
    
    return NextResponse.json({
      success: true,
      questions,
      topics: topicsArray,
      syllabus: syllabus || { subject: "General", topics: [] }
    });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch session data" });
  }
}

// Standardized DELETE handler for clearing session
export async function DELETE(req) {
  try {
    await connectDB();
    await Question.deleteMany({});
    await Syllabus.deleteMany({});
    return NextResponse.json({ success: true, message: "Cleared all academic data" });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message });
  }
}
