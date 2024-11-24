import express from "express";
import cors from "cors";
import loginRouter from "./services/login.js";
import usuarioRouter from "./services/usuario.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Rotas
// app.use("/login", loginRouter);
// app.use("/usuario", usuarioRouter);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
