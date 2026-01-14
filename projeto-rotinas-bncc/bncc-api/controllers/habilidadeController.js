import Habilidade from "../models/Habilidade.js";

// Criar nova habilidade
export const criarHabilidade = async (req, res) => {
  try {
    const habilidade = await Habilidade.create(req.body);
    res.status(201).json(habilidade);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

// Listar todas as habilidades
export const listarHabilidades = async (req, res) => {
  const habilidades = await Habilidade.find();
  res.json(habilidades);
};
