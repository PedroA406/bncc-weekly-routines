import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import habilidadeRoutes from "./routes/habilidades.js";
import rotinaRoutes from "./routes/rotinas.js";
import authRoutes from "./routes/auth.js"; // 🔒 novas rotas de login/cadastro

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 Rotas principais da API
app.use("/api/habilidades", habilidadeRoutes);
app.use("/api/rotinas", rotinaRoutes);
app.use("/api/auth", authRoutes); // 🔒 adiciona rotas de autenticação

// 🚀 Rota inicial de teste
app.get("/", (req, res) => {
  res.send("🚀 API BNCC rodando com sucesso!");
});

// ⚙️ Porta do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT} ✅`));
