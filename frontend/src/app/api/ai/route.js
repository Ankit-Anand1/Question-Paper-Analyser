import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.json();
    const { question, topics, recommendations } = data;

    const actualKey = process.env.OPENROUTER_API_KEY;

    if (!actualKey) {
      return NextResponse.json({
        success: false,
        answer: "The AI Assistant is not configured. Please add your OPENROUTER_API_KEY to the .env file and restart the server."
      });
    }

    const topicList = topics?.map(t => `${t.name} (${t.subject}, priority: ${t.priority}, freq: ${t.frequency}x)`).join("\n") || 'No topics analyzed yet.';

    const sysPrompt = `You are SyllabusIQ — an expert academic exam strategist.
    ${recommendations || 'Not generated yet.'}
    Topics: ${topicList}`;

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${actualKey}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "SyllabusIQ"
      },
      body: JSON.stringify({
        model: "openrouter/auto",
        messages: [
          { role: "system", content: sysPrompt },
          { role: "user", content: question }
        ]
      })
    });

    const aiData = await res.json();
    if (aiData.error) throw new Error(aiData.error.message);

    return NextResponse.json({
      success: true,
      answer: aiData.choices?.[0]?.message?.content || "No response."
    });
  } catch (error) {
    return NextResponse.json({ error: error.message, success: false, answer: "AI Error: " + error.message });
  }
}
