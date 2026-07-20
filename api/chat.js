export default async function handler(req, res) {
  const message = req.query.message;
  if (!message) {
    return res.status(400).json({ error: "Message parameter is required" });
  }

  const BACKEND = process.env.BACKEND_URL || "https://geoclub-backend.example.com";
  const target = `${BACKEND}/api/chat`;

  let lastError = null;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(target, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history: [] }),
        signal: AbortSignal.timeout(120000),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.response || `Server error: ${response.status}`);
      }

      const reply = data.response || data.reply || data.message || data.answer;
      if (reply) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        return res.status(200).json({ response: reply });
      }

      lastError = "empty_response";
    } catch (error) {
      lastError = error.message;
    }

    if (attempt < 2) {
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  return res.status(502).json({ error: lastError });
}
