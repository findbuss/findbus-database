import { compare } from "bcrypt";
import pool from "../config/db.config.js";
import { decrypt } from "../utils/crypto.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: "Preencha todos os campos!" });
  }

  try {
    const query = "SELECT * FROM usuarios WHERE email = $1";
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Usuário inexistente, cadastre-se." });
    }

    const user = result.rows[0];

    const decryptedNome = decrypt(user.nome);
    const decryptedCpf = decrypt(user.cpf);
    const decryptedEmail = decrypt(user.email);
    const decryptedTelefone = decrypt(user.telefone);

    const isPasswordValid = await compare(senha, user.senha);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Email ou senha estão incorretos!" });
    }

    res.status(200).json({
      message: "Login bem-sucedido!",
      userData: {
        decryptedNome,
        decryptedCpf,
        decryptedEmail,
        decryptedTelefone,
      },
    });
  } catch (error) {
    console.error("Erro ao autenticar usuário:", error);
    res.status(500).json({ message: "Erro ao processar o login." });
  }
});
