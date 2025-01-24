const express = require("express");
const { initializeDB } =  require("./db.js");
const { processCSVInChunks } = require("./utils.js");
const { config } = require("./config.js");

const app = express();
const PORT = 3000;

app.get("/process-csv", async (req, res) => {
  try {
    await processCSVInChunks(config.csvFilePath);
    res.send("CSV processing started");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing CSV");
  }
});

app.listen(PORT, async () => {
  await initializeDB();
  console.log(`Server running on http://localhost:${PORT}`);
});
