import express from "express";
import { pool } from "../config/db.config.js";

const router = express.Router();

// Criar um novo histórico
router.post("/", async (req, res) => {
  const historico = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO historico_usuario (id_usuario, tipo, stop_id, stop_name, route_id, shape_id, route_color, route_text_color, trip_id, route_long_name) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        historico.id_usuario,
        historico.tipo,
        historico.stop_id,
        historico.stop_name,
        historico.route_id,
        historico.shape_id,
        historico.route_color,
        historico.route_text_color,
        historico.trip_id,
        historico.route_long_name,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obter todos os históricos de um usuário
router.get("/:id_usuario", async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM historico_usuario WHERE id_usuario = $1`,
      [id_usuario]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar um histórico
router.put("/:id_historico", async (req, res) => {
  const { id_historico } = req.params;
  const historico = req.body;
  try {
    const result = await pool.query(
      `UPDATE historico_usuario SET tipo = $1, stop_id = $2, stop_name = $3, route_id = $4, shape_id = $5, route_color = $6, route_text_color = $7, trip_id = $8, route_long_name = $9 
       WHERE id_historico = $10 RETURNING *`,
      [
        historico.tipo,
        historico.stop_id,
        historico.stop_name,
        historico.route_id,
        historico.shape_id,
        historico.route_color,
        historico.route_text_color,
        historico.trip_id,
        historico.route_long_name,
        id_historico,
      ]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deletar um histórico
router.delete("/:id_historico", async (req, res) => {
  const { id_historico } = req.params;
  try {
    await pool.query(`DELETE FROM historico_usuario WHERE id_historico = $1`, [
      id_historico,
    ]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
