import { Router, type Request, type Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { db, songsTable } from "@workspace/db";
import { eq, ilike, or, sum } from "drizzle-orm";

const workspaceRoot = process.cwd().endsWith(path.join("artifacts", "api-server"))
  ? path.resolve(process.cwd(), "../..")
  : process.cwd();

const audioDir = path.resolve(workspaceRoot, "artifacts/api-server/uploads/audio");
const posterDir = path.resolve(workspaceRoot, "artifacts/api-server/uploads/posters");

fs.mkdirSync(audioDir, { recursive: true });
fs.mkdirSync(posterDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, file.fieldname === "audio" ? audioDir : posterDir);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.fieldname === "audio") {
      cb(null, file.mimetype.startsWith("audio/"));
    } else if (file.fieldname === "poster") {
      cb(null, file.mimetype.startsWith("image/"));
    } else {
      cb(null, false);
    }
  },
});

const router = Router();

router.get("/songs/stats", async (_req, res): Promise<void> => {
  const [result] = await db
    .select({ total: db.$count(songsTable), totalDuration: sum(songsTable.duration) })
    .from(songsTable);
  res.json({
    total: Number(result?.total ?? 0),
    totalDuration: Number(result?.totalDuration ?? 0),
  });
});

router.get("/songs", async (req, res): Promise<void> => {
  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
  let songs;
  if (q) {
    songs = await db
      .select()
      .from(songsTable)
      .where(or(ilike(songsTable.title, `%${q}%`), ilike(songsTable.artist, `%${q}%`)))
      .orderBy(songsTable.createdAt);
  } else {
    songs = await db.select().from(songsTable).orderBy(songsTable.createdAt);
  }
  res.json(
    songs.map((s) => ({
      id: s.id,
      title: s.title,
      artist: s.artist ?? null,
      duration: s.duration ?? null,
      hasPoster: !!s.posterFilename,
      createdAt: s.createdAt.toISOString(),
    }))
  );
});

router.post(
  "/songs",
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "poster", maxCount: 1 },
  ]),
  async (req: Request, res: Response): Promise<void> => {
    const files = req.files as Record<string, Express.Multer.File[]>;
    const audioFile = files?.["audio"]?.[0];
    const posterFile = files?.["poster"]?.[0];

    if (!audioFile) {
      res.status(400).json({ error: "Audio file is required" });
      return;
    }

    const title = req.body?.title?.trim();
    if (!title) {
      fs.unlinkSync(audioFile.path);
      if (posterFile) fs.unlinkSync(posterFile.path);
      res.status(400).json({ error: "Title is required" });
      return;
    }

    const artist = req.body?.artist?.trim() || null;

    const [song] = await db
      .insert(songsTable)
      .values({
        title,
        artist,
        audioFilename: audioFile.filename,
        posterFilename: posterFile?.filename ?? null,
      })
      .returning();

    res.status(201).json({
      id: song.id,
      title: song.title,
      artist: song.artist ?? null,
      duration: song.duration ?? null,
      hasPoster: !!song.posterFilename,
      createdAt: song.createdAt.toISOString(),
    });
  }
);

router.get("/songs/:id/audio", async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [song] = await db.select().from(songsTable).where(eq(songsTable.id, id));
  if (!song) {
    res.status(404).json({ error: "Song not found" });
    return;
  }

  const filePath = path.join(audioDir, song.audioFilename);
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "Audio file not found" });
    return;
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;
    const fileStream = fs.createReadStream(filePath, { start, end });
    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "audio/mpeg",
    });
    fileStream.pipe(res);
  } else {
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": "audio/mpeg",
      "Accept-Ranges": "bytes",
    });
    fs.createReadStream(filePath).pipe(res);
  }
});

router.get("/songs/:id/poster", async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [song] = await db.select().from(songsTable).where(eq(songsTable.id, id));
  if (!song?.posterFilename) {
    res.status(404).json({ error: "Poster not found" });
    return;
  }

  const filePath = path.join(posterDir, song.posterFilename);
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "Poster file not found" });
    return;
  }

  res.sendFile(filePath);
});

router.get("/songs/:id", async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [song] = await db.select().from(songsTable).where(eq(songsTable.id, id));
  if (!song) {
    res.status(404).json({ error: "Song not found" });
    return;
  }

  res.json({
    id: song.id,
    title: song.title,
    artist: song.artist ?? null,
    duration: song.duration ?? null,
    hasPoster: !!song.posterFilename,
    createdAt: song.createdAt.toISOString(),
  });
});

router.delete("/songs/:id", async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [song] = await db.delete(songsTable).where(eq(songsTable.id, id)).returning();
  if (!song) {
    res.status(404).json({ error: "Song not found" });
    return;
  }

  const audioPath = path.join(audioDir, song.audioFilename);
  if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);

  if (song.posterFilename) {
    const posterPath = path.join(posterDir, song.posterFilename);
    if (fs.existsSync(posterPath)) fs.unlinkSync(posterPath);
  }

  res.sendStatus(204);
});

export default router;
