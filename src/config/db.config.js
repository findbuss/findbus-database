import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "user", // substitua com suas credenciais
  host: "localhost",
  database: "findbus_db",
  password: "password",
  port: 5432,
});

const seedDatabase = async () => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const createTipoEnum = `
      DO $$ BEGIN
        CREATE TYPE tipo_enum AS ENUM ('ponto', 'linha');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    const createUsuarioTable = `
      CREATE TABLE IF NOT EXISTS usuario (
        id_usuario SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        cpf CHAR(11) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        telefone VARCHAR(15),
        senha VARCHAR(255) NOT NULL
      );
    `;

    const createFavoritosTable = `
      CREATE TABLE IF NOT EXISTS favoritos (
        id_favorito SERIAL PRIMARY KEY,
        id_usuario INT NOT NULL,
        tipo tipo_enum NOT NULL,
        stop_id INT,
        stop_name VARCHAR(255),
        route_id VARCHAR(50),
        shape_id INT,
        route_color CHAR(7),
        route_text_color CHAR(7),
        trip_id VARCHAR(50),
        route_long_name VARCHAR(255),
        FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
      );
    `;

    const createHistoricoUsuarioTable = `
      CREATE TABLE IF NOT EXISTS historico_usuario (
        id_historico SERIAL PRIMARY KEY,
        id_usuario INT NOT NULL,
        tipo tipo_enum NOT NULL,
        stop_id INT,
        stop_name VARCHAR(255),
        route_id VARCHAR(50),
        shape_id INT,
        route_color CHAR(7),
        route_text_color CHAR(7),
        trip_id VARCHAR(50),
        route_long_name VARCHAR(255),
        data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
      );
    `;

    await client.query(createTipoEnum);
    await client.query(createUsuarioTable);
    await client.query(createFavoritosTable);
    await client.query(createHistoricoUsuarioTable);

    await client.query("COMMIT");
    console.log("Tabelas criadas com sucesso!");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Erro ao criar tabelas:", error);
  } finally {
    client.release();
  }
};

seedDatabase().catch((err) => console.error("Erro ao executar seed:", err));

export { pool, seedDatabase };
