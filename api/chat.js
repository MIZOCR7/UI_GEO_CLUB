export default async function handler(req, res) {
  const message = req.query.message;
  if (!message) {
    return res.status(400).json({ error: "Message parameter is required" });
  }

  const BACKEND = "https://geoclub-backend.streamlit.app/";
  const target = BACKEND + "?api=chat&message=" + encodeURIComponent(message);

  try {
    const response = await fetch(target, { signal: AbortSignal.timeout(120000) });
    const html = await response.text();

    const match = html.match(/<!--GRS-->([\s\S]*?)<!--GRE-->/);
    const reply = match ? match[1].trim() : "Could not extract response from backend.";

    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json({ response: reply });
  } catch (error) {
    return res.status(502).json({ error: error.message });
  }
}
