export default async function handler(req, res) {
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const messages = body.messages;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-4o",
        messages,
        max_tokens: 800,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      const msg = data.error?.message || data.error || JSON.stringify(data);
      return res.status(response.status).json({ error: msg });
    }
    const text = data.choices?.[0]?.message?.content || "";
    res.json({ content: [{ text }] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
