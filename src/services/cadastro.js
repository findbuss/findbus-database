import express from "express";
import { hash } from "bcrypt";
import { pool } from "../config/db.config.js";
import { encrypt } from "../utils/crypto.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { nome, cpf, email, telefone, senha } = req.body;

  if (!nome || !cpf || !email || !senha) {
    return res
      .status(400)
      .json({ message: "Preencha todos os campos obrigatórios." });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await hash(senha, saltRounds);

    const encryptedNome = encrypt(nome);
    const encryptedCpf = encrypt(cpf);
    const encryptedEmail = encrypt(email);
    const encryptedTelefone = encrypt(telefone);

    const query = `
      INSERT INTO usuario (nome, cpf, email, telefone, senha)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id;
    `;
    const values = [
      encryptedNome,
      encryptedCpf,
      encryptedEmail,
      encryptedTelefone,
      hashedPassword,
    ];
    const result = await pool.query(query, values);

    res.status(201).json({
      message: "Usuário cadastrado com sucesso!",
      userId: result.rows[0].id,
    });
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);

    if (error.code === "23505") {
      return res.status(409).json({ message: "CPF ou email já cadastrado." });
    }

    res.status(500).json({ message: "Erro ao processar o cadastro." });
  }
});

export default router;
