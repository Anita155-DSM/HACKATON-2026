import { Router } from "express";
import { listarGlosario } from "../controllers/glossary.controller.js";

const router = Router();

// Glosario (público: lo usan el traductor y el alumno)
router.get("/", listarGlosario);

export default router;
