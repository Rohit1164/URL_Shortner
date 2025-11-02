import { nanoid } from "nanoid";
import URL from "../models/URL.js";

export async function handleUpdateURL(req, res) {
  try {
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: "URL is required" });

    const shortId = nanoid(8);

    await URL.create({
      shortId,
      redirectURL: body.url,
      visitHistory: [],
    });

    return res.json({ id: shortId });
  } catch (err) {
    return res.status(500).json({ error: "Server error", detail: err.message });
  }
}

export async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortid;

  const result = await URL.findOneAndUpdate(
    { shortId },
    { $push: { visitHistory: { timestamp: Date.now() } } }
  );
  if (!result) {
    return res.status(404).json({ error: "Short URL not found" });
  }

  return res.redirect(result.redirectURL);
  // .json({
  //   totalclick: result.visitHistory.length,
  //   analytics: result.visitHistory,
  // });
}
