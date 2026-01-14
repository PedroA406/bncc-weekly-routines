import express from "express";
import { gerarRotina, listarRotinas } from "../controllers/rotinaController.js";

const router = express.Router();

router.post("/gerar", gerarRotina);
router.get("/", listarRotinas);

export default router;
