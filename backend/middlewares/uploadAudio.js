import multer from "multer";
import fs from "fs";

const DIR = "uploads/audios";
fs.mkdirSync(DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, DIR),
  filename: (req, file, cb) => {
    const map = {
      "audio/webm": "webm",
      "audio/mp4": "mp4",
      "audio/ogg": "ogg",
      "audio/mpeg": "mp3",
    };
    const ext = map[file.mimetype] || "webm";
    const nombre = `tr-${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`;
    cb(null, nombre)
  },
});

const TIPOS_OK = ["audio/webm", "audio/mp4", "audio/ogg", "audio/mpeg"];
const fileFilter = (req, file, cb) => {
  if (TIPOS_OK.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Tipo de audio no permitido"), false);
};

export const uploadAudio = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 },
});