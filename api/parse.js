export default async function handler(req, res) {
  const { url } = req.body;

  // Читаем страницу через Jina AI
  const jinaRes = await fetch(`https://r.jina.ai/${url}`);
  const pageText = await jinaRes.text();

  // Просим AI выделить секции гранта
  const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct:free",
      messages: [
        {
          role: "user",
          content: `Ты эксперт по грантам. Прочитай текст со страницы гранта и выдели все секции которые нужно заполнить в заявке. Верни ТОЛЬКО валидный JSON массив, без пояснений, без markdown, без лишних символов. Формат: [{"id":"section_1","label":"Название секции","hint":"что писать в этой секции"}]. Текст страницы: ${pageText.slice(0, 3000)}`,
        },
      ],
    }),
  });

  const aiData = await aiRes.json();
  const text = aiData.choices?.[0]?.message?.content || "[]";
  
  try {
    const clean = text.replace(/```json|```/g, "").trim();
    const sections = JSON.parse(clean);
    res.json({ sections });
  } catch (e) {
    res.json({ sections: [], error: "Не удалось распознать секции" });
  }
}