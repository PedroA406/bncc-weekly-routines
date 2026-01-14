import express from "express";
import { criarHabilidade, listarHabilidades } from "../controllers/habilidadeController.js";

const router = express.Router();

router.post("/", criarHabilidade);
router.get("/", listarHabilidades);

export default router;
