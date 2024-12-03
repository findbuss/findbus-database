import express from "express";
import { hash } from "bcrypt";
import { pool } from "../config/db.config.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { nome, cpf, email, telefone, senha } = req.body;
  try {
    const senhaHash = await hash(senha, 10);
    const result = await pool.query(
      `INSERT INTO usuario (nome, cpf, email, telefone, senha) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nome, cpf, email, telefone, senhaHash]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
