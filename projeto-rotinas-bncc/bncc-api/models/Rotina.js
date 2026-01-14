import mongoose from "mongoose";

const rotinaSchema = new mongoose.Schema({
  ano: { type: String, required: true },
  bimestre: { type: Number, required: true },
  semana: { type: Number, required: true },
  habilidades: [{ type: mongoose.Schema.Types.ObjectId, ref: "Habilidade" }],
  objetivos: String,
  metodologia: String,
  recursos: String,
  avaliacao: String,
  observacoes: String
});

export default mongoose.model("Rotina", rotinaSchema);
