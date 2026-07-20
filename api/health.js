export default async function handler(req, res) {
  const BACKEND = process.env.BACKEND_URL || "https://miaaiassistant-geology-professor.hf.space";
  const target = `${BACKEND}/`;

  try {
    const response = await fetch(target, { signal: AbortSignal.timeout(30000) });
    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json(data);
  } catch (error) {
    return res.status(502).json({ status: "unreachable", error: error.message });
  }
}
