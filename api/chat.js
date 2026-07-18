export default async function handler(req, res) {
  const message = req.query.message;
  if (!message) {
    return res.status(400).json({ error: "Message parameter is required" });
  }

  const BACKEND = "https://geoclub-backend.streamlit.app/";
  const target = BACKEND + "?api=chat&message=" + encodeURIComponent(message);

  let lastError = null;

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const response = await fetch(target, { signal: AbortSignal.timeout(120000) });
      const html = await response.text();

      const reply = extractReply(html);
      if (reply) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        return res.status(200).json({ response: reply });
      }

      lastError = "empty_response";
    } catch (error) {
      lastError = error.message;
    }

    if (attempt < 4) {
      await new Promise(r => setTimeout(r, 5000 + attempt * 3000));
    }
  }

  return res.status(502).json({ error: lastError });
}

function extractReply(html) {
  if (!html) return null;

  const m = html.match(/<!--GRS-->([\s\S]*?)<!--GRE-->/);
  if (m) return clean(m[1]);

  const jm = html.match(/\{"response"\s*:\s*"((?:[^"\\]|\\.)*?)"\s*\}/);
  if (jm) return clean(jm[1]);

  const blocks = html.match(/\{[^{}]{30,}\}/g) || [];
  for (const block of blocks) {
    try {
      const d = JSON.parse(block);
      const v = d.response || d.reply || d.answer;
      if (v && typeof v === "string" && v.length > 5) return clean(v);
    } catch {}
  }

  const tdm = html.match(/data-testid="stMarkdown"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/i);
  if (tdm) {
    const txt = tdm[1].replace(/<[^>]+>/g, "").trim();
    if (txt.length > 5) return clean(txt);
  }

  return null;
}

function clean(text) {
  return text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
             .replace(/&#x27;/g, "'").replace(/&quot;/g, '"')
             .replace(/\s+/g, " ").trim();
}
