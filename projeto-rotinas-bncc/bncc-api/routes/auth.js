import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


const router = express.Router();
const SECRET = process.env.JWT_SECRET || "segredo_super_seguro";

// 📍 Cadastro
router.post("/register", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ message: "Preencha todos os campos!" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email já cadastrado!" });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);
    const novoUsuario = new User({ nome, email, senha: hashedPassword });
    await novoUsuario.save();

    res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao cadastrar usuário.", error });
  }
});

// 📍 Login
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Usuário não encontrado!" });

    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) return res.status(401).json({ message: "Senha incorreta!" });

    const token = jwt.sign({ id: user._id, nome: user.nome }, SECRET, { expiresIn: "1d" });

    res.status(200).json({ message: "Login realizado com sucesso!", token, nome: user.nome });
  } catch (error) {
    res.status(500).json({ message: "Erro ao fazer login.", error });
  }
});

export default router;
