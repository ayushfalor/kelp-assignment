const fs = require("node:fs");
const readline = require("node:readline");
const { Worker } = require("worker_threads");

const processCSVInChunks = async (filePath) => {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: fileStream });

  let header = [];
  let chunk = [];
  const CHUNK_SIZE = 1000;

  for await (const line of rl) {
    if (!header.length) {
      header = line.split(",");
    } else {
      chunk.push(line.split(","));
      if (chunk.length === CHUNK_SIZE) {
        await processChunk(header, chunk);
        chunk = [];
      }
    }
  }

  if (chunk.length) await processChunk(header, chunk);
};

const processChunk = (header, chunk) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./src/worker.js", {
      workerData: { header, chunk },
    });

    worker.on("message", resolve);
    worker.on("error", reject);
  });
};

const parseCSVRow = (header, row) => {
  const data = {};
  const additionalInfo = {};

  header.forEach((key, index) => {
    const keys = key.includes(".") ? key.split(".") : [key];

    // Dynamically build nested structure for keys with "."
    let temp = data;
    keys.forEach((k, i) => {
      if (i === keys.length - 1) {
        temp[k] = row[index];
      } else {
        temp[k] = temp[k] || {};
        temp = temp[k];
      }
    });
  });

  // Any key not contributing to data will go to additionalInfo
  Object.keys(data).forEach((key) => {
    if (typeof data[key] !== "object" || Object.keys(data[key]).length === 0) {
      additionalInfo[key] = data[key];
      delete data[key];
    }
  });

  return {
    data,
    additional_info: additionalInfo,
  };
};


module.export = {
  processCSVInChunks,
  parseCSVRow
}