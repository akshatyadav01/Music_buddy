import { Router } from "express";
import songsRouter from "./songs.js";

const router = Router();

router.get("/healthz", (_req, res) => {
  res.json({ status: "ok" });
});

router.use(songsRouter);

export default router;
