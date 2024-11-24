import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres", // substitua com suas credenciais
  host: "localhost",
  database: "sistema",
  password: "senha",
  port: 5432,
});

export default pool;
