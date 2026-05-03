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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "Gemini API Key is not configured in .env (GEMINI_API_KEY)" });
    }

    // AI Prompt for smart analysis
    const prompt = `
      You are a world-class Academic Exam Intelligence Assistant.
      
      CURRICULUM CONTEXT (Syllabus):
      ${syllabusText || "No syllabus provided. Deduce modules and subjects from the questions."}
      
      QUESTION PAPERS CONTENT:
      ${paperText}

      TASK:
      1. Analyze the papers against the syllabus.
      2. Group findings into logical "Modules" (e.g., Module 1, Module 2) based on the syllabus structure.
      3. For each topic, calculate exactly how many times it appeared across all provided papers.
      4. Identify "Repeated Questions" that are nearly identical across years.
      
      STRUCTURED RESPONSE (JSON):
      {
        "modules": [
          {
            "name": "Module 1: Title",
            "topics": [
              { "name": "Topic Name", "frequency": 5, "priority": "high", "priorityScore": 95 }
            ]
          }
        ],
        "repeatedQuestions": [
          { "text": "Who is the father of ML?", "frequency": 3, "subject": "Machine Learning" }
        ],
        "recommendations": "### 🔥 Study Strategy\n1. **Focus on Module 1**: It covers 40% of the marks...\n2. **Master Repeated Questions**: The question on paging is a guaranteed 10 marks...\n3. **Skip Low Priority**: Don't waste time on Topic X..."
      }
    `;

    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "systemInstruction": {
          "parts": [{ "text": "You are a professional academic data extractor. Always return only valid JSON." }]
        },
        "contents": [
          { "role": "user", "parts": [{ "text": prompt }] }
        ],
        "generationConfig": { 
          "responseMimeType": "application/json",
          "temperature": 0.2
        }
      })
    });

    const aiData = await aiRes.json();
    if (aiData.error) {
      console.error("Gemini API Error:", aiData.error);
      throw new Error(`Gemini API Error: ${aiData.error.message || 'Rate limited or service unavailable'}`);
    }

    let analysis;
    try {
      let content = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      const jsonStart = content.indexOf('{');
      const jsonEnd = content.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        content = content.substring(jsonStart, jsonEnd + 1);
      }
      analysis = JSON.parse(content);
    } catch (e) {
      console.error("AI failed to return JSON", aiData);
      throw new Error("AI analysis failed to format the response into JSON. Please click Analyze again.");
    }

    // Clear old questions and save new ones
    await Question.deleteMany({});
    
    // Flatten modules into topics for the store, but keep module info
    const flattenedTopics = [];
    (analysis.modules || []).forEach(mod => {
      mod.topics.forEach(t => {
        flattenedTopics.push({ ...t, module: mod.name, id: Math.random().toString(36).substr(2, 9) });
      });
    });

    // Save structured syllabus info if subjects were found
    const allTopics = flattenedTopics.map(t => t.name);
    const mainSubject = flattenedTopics[0]?.subject || "General";
    
    await Syllabus.findOneAndUpdate(
      {}, 
      { subject: mainSubject, topics: allTopics },
      { upsert: true, new: true }
    );

    for (const q of analysis.repeatedQuestions || []) {
      await Question.create({
        text: q.text,
        subject: q.subject,
        frequency: q.frequency,
        year: 2024
      });
    }

    return NextResponse.json({
      success: true,
      topics: flattenedTopics,
      questions: analysis.repeatedQuestions,
      recommendations: analysis.recommendations,
      msg: "Deep AI Analysis Complete"
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message, success: false });
  }
}
