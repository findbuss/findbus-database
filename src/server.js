import express from "express";
import cors from "cors";
import loginRouter from "./services/login.js";
import usuarioRouter from "./services/cadastro.js";
import historicoRouter from "./services/historico.js";
import favoritosRouter from "./services/favoritos.js";
import { seedDatabase } from "./config/db.config.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

seedDatabase();

// Rotas
app.use("/login", loginRouter);
app.use("/usuario", usuarioRouter);
app.use("/historico", historicoRouter);
app.use("/favoritos", favoritosRouter);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
