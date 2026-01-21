const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const BASE_DIR = path.join(__dirname, "jobs");

if (!fs.existsSync(BASE_DIR)) {
  fs.mkdirSync(BASE_DIR, { recursive: true });
}

const createJobDir = () => {
  const jobId = uuid();
  const jobDir = path.join(BASE_DIR, jobId);
  fs.mkdirSync(jobDir);
  return { jobId, jobDir };
};

module.exports = { createJobDir };
