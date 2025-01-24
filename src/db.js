const { Pool } =  require("pg");
const { config } = require("./config.js");

const pool = new Pool(config.db);

const initializeDB = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR NOT NULL,
      age INT NOT NULL,
      address JSONB,
      additional_info JSONB
    );
  `;
  await pool.query(createTableQuery);
};

module.exports = {
  pool,
  initializeDB
}