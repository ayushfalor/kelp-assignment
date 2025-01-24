const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  config : {
    csvFilePath: process.env.CSV_FILE_PATH,
    db: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT, 10),
    }
  }
}
