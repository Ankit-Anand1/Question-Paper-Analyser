import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Question from "@/models/Question";
import Syllabus from "@/models/Syllabus";

export async function GET() {
  try {
    await connectDB();

    const questions = await Question.find();
    if (!questions || questions.length === 0) {
      return NextResponse.json({
        success: false,
        report: "No exam data found. Please upload question papers first to generate the Smart Strategy Report."
      });
    }

    const formatted = questions.map(q => ({
      question: q.text,
      topic: q.topic,
      subject: q.subject,
      frequency: q.frequency,
      difficulty: q.difficulty,
      year: q.year
    }));

    const syllabus = await Syllabus.findOne();
    const syllabusSubject = syllabus?.subject || "General";

    const prompt = `
You are an expert exam strategist and "topper mentor".

Analyze this data of previous year questions + syllabus for ${syllabusSubject}:

${JSON.stringify(formatted).slice(0, 5000)}

Generate output EXACTLY in this format using proper markdown:

# 🔥 Complete Exam Strategy Report

Great—you've given exactly what most students don't do. By analyzing these past papers, we can decode exactly what the examiner is looking for. Let's crack this!

## 🔹 MODULE X: [Module Name]

### ⭐ Repeated Topics
- Topic A
- Topic B

### 📊 Year-wise Trend

| Topic | 2023 | 2024 | 2025 |
|---|---|---|---|
| Topic A | ✔ | ✔ | ✔ |
| Topic B | ✔ | ✖ | ✔ |

### 🎯 Expected Questions
- [Expected question 1]
- [Expected question 2]

### 🎥 YouTube Module Playlist
[▶ Watch: Module Name Gate Smashers Full Playlist](https://www.youtube.com/results?search_query=Module+Name+Gate+Smashers+Playlist)

## 🔥 Most Repeated Questions
- [Question text] ([N] times)

## 📈 Year-wise Analysis
[Brief paragraph]

## ⚡ 80/20 Strategy
[Which 20% gives 80% marks?]

## 🕒 Last Day Revision Plan
[Bullet points for morning, afternoon, evening]

## 🔮 Final Prediction
[Brief paragraph]

## 📚 Master Subject Playlist
[▶ Watch: COMPLETE ${syllabusSubject.toUpperCase()} PLAYLIST](https://www.youtube.com/results?search_query=${encodeURIComponent(syllabusSubject)}+Gate+Smashers+Full+Playlist)

IMPORTANT INSTRUCTIONS:
- You MUST use ONLY proper Markdown formatting.
- For Tables, you MUST use pipe '|' characters and the exact markdown separator '|---|---|---|---|'. Do NOT output raw spaced text.
- Use ## for main headings and ### for section subheadings.
- Keep the anchor tags correctly formatted as [Link Text](URL). Do not add raw parentheses outside.
- Use emojis exactly as demonstrated.
    `;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        report: "Gemini API Key is missing. Please configure GEMINI_API_KEY in your .env file."
      });
    }

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "contents": [
          { "role": "user", "parts": [{ "text": prompt }] }
        ]
      })
    });

    const geminiData = await res.json();
    if (geminiData.error) {
      return NextResponse.json({ 
        success: false, 
        report: `AI Error: ${geminiData.error.message}` 
      });
    }

    const reportText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "Failed to generate AI report.";

    return NextResponse.json({
      success: true,
      report: reportText,
    });
  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json({ 
      success: false, 
      report: "Server error occurred while generating the report. " + error.message 
    });
  }
}
