import { parentPort, workerData } from require("worker_threads");
import { pool } from require("./db.js");
const { parseCSVRow } = require("./utils.js");

const { header, chunk } = workerData;

(async () => {
  const client = await pool.connect();
  try {
    const queries = chunk.map((row) => {
      const parsedData = parseCSVRow(header, row);
      return client.query(
        "INSERT INTO users (name, age, address, additional_info) VALUES ($1, $2, $3, $4)",
        [parsedData.name, parsedData.age, parsedData.address, parsedData.additional_info]
      );
    });
    await Promise.all(queries);
    parentPort.postMessage("Chunk processed successfully");
  } catch (error) {
    console.error("Worker Error:", error);
  } finally {
    client.release();
  }
})();
