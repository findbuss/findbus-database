import express from "express";
import {pool} from "../config/db.config.js";

const router = express.Router();

// Criar um novo favorito
router.post("/", async (req, res) => {
  const favorito = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO favoritos (id_usuario, tipo, stop_id, stop_name, route_id, shape_id, route_color, route_text_color, trip_id, route_long_name) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        favorito.id_usuario,
        favorito.tipo,
        favorito.stop_id,
        favorito.stop_name,
        favorito.route_id,
        favorito.shape_id,
        favorito.route_color,
        favorito.route_text_color,
        favorito.trip_id,
        favorito.route_long_name,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obter todos os favoritos de um usuário
router.get("/:id_usuario", async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM favoritos WHERE id_usuario = $1`,
      [id_usuario]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar um favorito
router.put("/:id_favorito", async (req, res) => {
  const { id_favorito } = req.params;
  const favorito = req.body;
  try {
    const result = await pool.query(
      `UPDATE favoritos SET tipo = $1, stop_id = $2, stop_name = $3, route_id = $4, shape_id = $5, route_color = $6, route_text_color = $7, trip_id = $8, route_long_name = $9 
       WHERE id_favorito = $10 RETURNING *`,
      [
        favorito.tipo,
        favorito.stop_id,
        favorito.stop_name,
        favorito.route_id,
        favorito.shape_id,
        favorito.route_color,
        favorito.route_text_color,
        favorito.trip_id,
        favorito.route_long_name,
        id_favorito,
      ]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deletar um favorito
router.delete("/:id_favorito", async (req, res) => {
  const { id_favorito } = req.params;
  try {
    await pool.query(`DELETE FROM favoritos WHERE id_favorito = $1`, [
      id_favorito,
    ]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
