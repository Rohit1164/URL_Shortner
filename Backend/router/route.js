import express from "express";
import URL from "../models/URL.js";
import { handleUpdateURL, handleGetAnalytics } from "../controller/url.js";

const router = express.Router();

router.post("/", handleUpdateURL);
router.get("/analytics/:shortid", handleGetAnalytics);

router.get("/:shortid", async (req, res) => {
  const entry = await URL.findOne({ shortId: req.params.shortid });
  if (!entry) return res.status(404).send("Not found");

  entry.visitHistory.push({ timeStamp: Date.now() });
  await entry.save();

  return res.redirect(entry.redirectURL);
});

export default router;
