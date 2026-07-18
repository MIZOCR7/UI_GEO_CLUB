export default async function handler(req, res) {
  const BACKEND = "https://geoclub-backend.streamlit.app/?api=health";

  try {
    const response = await fetch(BACKEND, { signal: AbortSignal.timeout(30000) });
    const text = await response.text();

    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json({ status: text });
  } catch (error) {
    return res.status(502).json({ status: "unreachable", error: error.message });
  }
}
