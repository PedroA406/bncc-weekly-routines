import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import Habilidade from "./models/Habilidade.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const file6 = path.join(__dirname, "data", "habilidades6.json");
const file7 = path.join(__dirname, "data", "habilidades7.json");

// Conecta ao banco
await connectDB();

// Lê os arquivos JSON
const habilidades6 = JSON.parse(fs.readFileSync(file6, "utf-8"));
const habilidades7 = JSON.parse(fs.readFileSync(file7, "utf-8"));

// Converte o campo 'ano' para número (6 ou 7)
const convertAno = (habilidades) =>
  habilidades.map(h => ({
    ...h,
    ano: Number(h.ano.replace("º ano", "").trim())
  }));

const habilidades6Num = convertAno(habilidades6);
const habilidades7Num = convertAno(habilidades7);

// Limpa a coleção
await Habilidade.deleteMany({});

// Insere no banco
await Habilidade.insertMany([...habilidades6Num, ...habilidades7Num]);

console.log("✅ Habilidades inseridas com sucesso!");
process.exit();
