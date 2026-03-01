export default async function handler(req, res) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct:free",
      messages: req.body.messages,
    }),
  });
  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "";
  res.json({ content: [{ text }] });
}