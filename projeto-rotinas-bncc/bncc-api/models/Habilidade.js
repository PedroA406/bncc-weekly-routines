import mongoose from "mongoose";

const habilidadeSchema = new mongoose.Schema({
  codigo: { type: String, required: true },
  ano: { type: String, required: true },
  descricao: { type: String, required: true },
});

export default mongoose.model("Habilidade", habilidadeSchema);
