import express from "express";
import { compare } from "bcrypt";
import { pool } from "../config/db.config.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, senha } = req.body;
  try {
    const result = await pool.query(`SELECT * FROM usuario WHERE email = $1`, [
      email,
    ]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Email ou senha incorretos" });
    }
    const usuario = result.rows[0];
    const senhaValida = await compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: "Email ou senha incorretos" });
    }
    res.status(200).json({ message: "Login bem-sucedido", usuario });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
