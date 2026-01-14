import mongoose from "mongoose";
import dotenv from "dotenv";
import Rotina from "./models/Rotina.js";

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🗑️ Limpando rotinas antigas...");
    await Rotina.deleteMany({});

    console.log("Criando rotinas vazias (apenas estrutura)...");
    
    // Você pode adicionar rotinas fixas aqui se quiser

    console.log("✅ Seed de rotinas concluído!");
    process.exit();
  } catch (err) {
    console.error("❌ Erro no seed:", err);
    process.exit(1);
  }
}

seed();
