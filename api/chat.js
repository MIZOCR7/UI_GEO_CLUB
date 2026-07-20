export default async function handler(req, res) {
  const message = req.query.message;
  if (!message) {
    return res.status(400).json({ error: "Message parameter is required" });
  }

  const FASTAPI   = process.env.FASTAPI_URL || "https://geology-club-api.onrender.com";
  const STREAMLIT = "https://geoclub-backend.streamlit.app/";

  let lastError = null;

  // Try FastAPI first, fall back to Streamlit
  for (const source of ["fastapi", "streamlit"]) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const target = source === "fastapi"
          ? `${FASTAPI}/chat`
          : `${STREAMLIT}?api=chat&message=${encodeURIComponent(message)}`;

        const fetchOpts = { signal: AbortSignal.timeout(120000) };
        const body = source === "fastapi"
          ? JSON.stringify({ message })
          : undefined;

        const response = source === "fastapi"
          ? await fetch(target, { ...fetchOpts, method: "POST", headers: { "Content-Type": "application/json" }, body })
          : await fetch(target, fetchOpts);

        if (!response.ok) {
          lastError = `HTTP ${response.status}`;
          continue;
        }

        if (source === "fastapi") {
          const data = await response.json();
          if (data.response) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            return res.status(200).json({ response: data.response });
          }
        } else {
          const html = await response.text();
          const reply = extractStreamlitReply(html);
          if (reply) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            return res.status(200).json({ response: reply });
          }
        }

        lastError = "empty_response";
      } catch (error) {
        lastError = error.message;
      }

      if (attempt < 2) await new Promise(r => setTimeout(r, 5000));
    }
  }

  return res.status(502).json({ error: lastError });
}

function extractStreamlitReply(html) {
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
  return null;
}

function clean(text) {
  return text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
             .replace(/&#x27;/g, "'").replace(/&quot;/g, '"')
             .replace(/\s+/g, " ").trim();
}
