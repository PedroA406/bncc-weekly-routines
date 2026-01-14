import Rotina from "../models/Rotina.js";
import Habilidade from "../models/Habilidade.js";
import fs from "fs";
import path from "path";

// Carregar JSON de sugestões
const sugestoesPath = path.resolve("data/sugestoesMatematica.json");
const sugestoes = JSON.parse(fs.readFileSync(sugestoesPath, "utf8"));

export const gerarRotina = async (req, res) => {
  try {
    let { ano, bimestre, semana } = req.body;

    // Se ano vier como string ("6º ano"), converte para número
    if (typeof ano === "string") {
      ano = Number(ano.replace("º ano", "").trim());
    }

    // Buscar habilidades do banco
    const habilidades = await Habilidade.find({ ano })
      .skip((semana - 1) * 2)
      .limit(2);

    if (habilidades.length === 0) {
      return res.status(404).json({ message: "Nenhuma habilidade encontrada para esse ano." });
    }

    // Detectar tema automaticamente
    let temaEncontrado = null;
    habilidadeLoop:
    for (const habilidade of habilidades) {
      const descricao = habilidade.descricao.toLowerCase();

      for (const area in sugestoes) {
        for (const item of sugestoes[area]) {
          for (const palavra of item.palavras) {
            if (descricao.includes(palavra.toLowerCase())) {
              temaEncontrado = item;
              break habilidadeLoop;
            }
          }
        }
      }
    }

    // Se não encontrar tema, usar padrão
    const tema = temaEncontrado || {
      objeto: "Desenvolver habilidades matemáticas essenciais.",
      metodologia: "Aulas explicativas e atividades práticas.",
      recursos: "Quadro, caderno e exercícios.",
      avaliacao: "Observação contínua e atividades avaliativas.",
    };

    // Criar rotina
    const novaRotina = await Rotina.create({
      ano,
      bimestre,
      semana,
      habilidades,
      objetivos: tema.objeto,
      metodologia: tema.metodologia,
      recursos: tema.recursos,
      avaliacao: tema.avaliacao,
      observacoes: temaEncontrado
        ? `Tema identificado automaticamente: ${temaEncontrado.tema}.`
        : "Tema não identificado automaticamente."
    });

    return res.status(201).json({ rotina: novaRotina });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao gerar rotina.", error });
  }
};

// Listar rotinas
export const listarRotinas = async (req, res) => {
  const rotinas = await Rotina.find().populate("habilidades");
  res.json(rotinas);
};
