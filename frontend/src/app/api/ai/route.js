import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.json();
    const { question, topics, recommendations } = data;

    const actualKey = process.env.GEMINI_API_KEY;

    if (!actualKey) {
      return NextResponse.json({
        success: false,
        answer: "The AI Assistant is not configured yet. Please add your GEMINI_API_KEY to the .env file and restart the server."
      });
    }

    const topicList = topics?.map(t => `${t.name} (${t.subject}, priority: ${t.priority}, freq: ${t.frequency}x)`).join("\n") || 'No topics analyzed yet.';

    const sysPrompt = `You are SyllabusIQ — an expert academic exam strategist.

CONTEXT FROM PAPER ANALYSIS:
Priority Topics:
${topicList}

AI Study Strategy from Analysis:
${recommendations || 'Not generated yet — user has not uploaded papers.'}

INSTRUCTIONS:
- Give concise, actionable advice based on the above data
- Use bullet points and bold for emphasis
- Stay focused on exam preparation
- If no data is available, ask the user to upload their papers first`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${actualKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "systemInstruction": {
          "parts": [{ "text": sysPrompt }]
        },
        "contents": [
           { "role": "user", "parts": [{ "text": question }] }
        ]
      })
    });

    const geminiData = await res.json();
    
    if (geminiData.error) {
      return NextResponse.json({
        success: false,
        answer: `AI Error: ${geminiData.error.message}`
      });
    }

    return NextResponse.json({
      success: true,
      answer: geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated."
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to reach AI Engine", success: false, answer: "Connection error. Please try again." });
  }
}
