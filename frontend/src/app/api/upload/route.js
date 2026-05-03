import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Question from "@/models/Question";
import Syllabus from "@/models/Syllabus";
import pdf from "pdf-parse";

export async function POST(req) {
  try {
    await connectDB();

    const data = await req.formData();
    const paperFiles = data.getAll("papers");
    const syllabusFiles = data.getAll("syllabus");

    let paperText = "";
    let syllabusText = "";

    // Extract text from paper files
    for (const file of paperFiles) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const parsed = await pdf(buffer);
      paperText += `\n--- Paper: ${file.name} ---\n${parsed.text}\n`;
    }

    // Extract text from syllabus files
    for (const file of syllabusFiles) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const parsed = await pdf(buffer);
      syllabusText += `\n--- Syllabus: ${file.name} ---\n${parsed.text}\n`;
    }

    // If syllabus was uploaded, save it
    if (syllabusText.trim()) {
      await Syllabus.deleteMany({}); // Keep it simple: one active curriculum
      await Syllabus.create({ content: syllabusText });
    } else {
      // Try to fetch existing syllabus if none uploaded
      const existing = await Syllabus.findOne({}).sort({ updatedAt: -1 });
      if (existing) syllabusText = existing.content;
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "OpenRouter API Key is not configured in .env (OPENROUTER_API_KEY)" });
    }

    const prompt = `You are an expert exam strategist and "topper mentor".
    Analyze this exam data and return ONLY a valid JSON object.
    
    CURRICULUM: ${syllabusText || "Deduce from questions"}
    PAPERS: ${paperText}

    JSON Structure:
    {
      "modules": [{ "name": "Mod 1", "topics": [{ "name": "Topic", "frequency": 5, "priority": "high", "priorityScore": 90 }] }],
      "repeatedQuestions": [{ "text": "Question?", "frequency": 2, "subject": "Sub" }],
      "recommendations": "Generate a highly detailed, comprehensive markdown strategy report here. Use EXACTLY this format:\n\n# 🔥 Complete Exam Strategy Report\n\nGreat—you've given exactly what most students don't do. By analyzing these past papers, we can decode exactly what the examiner is looking for. Let's crack this!\n\n## 🔹 MODULE X: [Module Name]\n\n### ⭐ Repeated Topics\n- Topic A\n- Topic B\n\n### 📊 Year-wise Trend\n| Topic | 2023 | 2024 | 2025 |\n|---|---|---|---|\n| Topic A | ✔ | ✔ | ✔ |\n| Topic B | ✔ | ✖ | ✔ |\n\n### 🎯 Expected Questions\n- [Expected question 1]\n- [Expected question 2]\n\n## 🔥 Most Repeated Questions\n- [Question text] ([N] times)\n\n## 📈 Year-wise Analysis\n[Detailed paragraph]\n\n## ⚡ 80/20 Strategy\n[Which 20% gives 80% marks? Detailed breakdown]\n\n## 🕒 Last Day Revision Plan\n[Bullet points for morning, afternoon, evening]\n\n## 🔮 Final Prediction\n[Detailed paragraph]"
    }
    
    IMPORTANT: The "recommendations" field MUST contain the full markdown text. Do NOT use backticks around the markdown inside the JSON value. Ensure it is properly escaped JSON string.`;

    console.log("--- AI Analysis Start ---");
    console.log("Model: openrouter/auto");
    
    const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "SyllabusIQ"
      },
      body: JSON.stringify({
        model: "openrouter/auto",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1
      })
    });

    const aiData = await aiRes.json();
    console.log("AI Response Status:", aiRes.status);
    
    if (aiData.error) {
      console.error("AI Error:", aiData.error);
      return NextResponse.json({ success: false, error: aiData.error.message });
    }

    let content = aiData.choices?.[0]?.message?.content || "{}";
    
    let analysis;
    try {
      const jsonStart = content.indexOf('{');
      const jsonEnd = content.lastIndexOf('}');
      if (jsonStart === -1) throw new Error("No JSON found in AI response");
      
      const cleanJson = content.substring(jsonStart, jsonEnd + 1);
      analysis = JSON.parse(cleanJson);
      console.log("--- AI Analysis Success ---");
    } catch (e) {
      console.error("AI returned invalid JSON:", content);
      return NextResponse.json({ 
        success: false, 
        error: "AI failed to format the data correctly. Please try again or use the Load Demo button." 
      });
    }

    // Flatten modules into topics for the store
    let flattenedTopics = [];
    (analysis.modules || []).forEach(mod => {
      (mod.topics || []).forEach(t => {
        flattenedTopics.push({ ...t, module: mod.name, id: Math.random().toString(36).substr(2, 9) });
      });
    });

    // Create a very basic fallback if AI returns nothing
    const safeTopics = flattenedTopics.length > 0 ? flattenedTopics : [
      { id: 't1', name: 'Exam Core Concepts', subject: 'General', frequency: 5, priority: 'high', priorityScore: 90, module: 'Module 1' }
    ];

    const safeQuestions = (analysis.repeatedQuestions && analysis.repeatedQuestions.length > 0) 
      ? analysis.repeatedQuestions 
      : [{ text: "Fundamental topics covered in the provided papers.", subject: "General", frequency: 1 }];

    const safeRecs = analysis.recommendations || "Focus on the core concepts identified in the papers. Prioritize high-frequency modules.";

    // Save to DB
    await Question.deleteMany({});
    for (const q of safeQuestions) {
      await Question.create({
        text: q.text,
        subject: q.subject || "General",
        frequency: q.frequency || 1,
        year: 2024
      });
    }

    await Syllabus.findOneAndUpdate(
      {}, 
      { 
        subject: safeTopics[0].subject, 
        topics: safeTopics.map(t => t.name), 
        content: safeRecs 
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      topics: safeTopics,
      questions: safeQuestions,
      recommendations: safeRecs,
      msg: "Analysis Complete"
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message, success: false });
  }
}
