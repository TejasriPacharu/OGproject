const { exec } = require("child_process");

const EXECUTOR_IMAGE = "oj-executor";

const runDocker = ({ language, jobDir }) => {
  return new Promise((resolve) => {
    const cmd = `
      docker run --rm \
      --cpus="0.5" \
      --memory="256m" \
      --network=none \
      -v ${jobDir}:/app \
      ${EXECUTOR_IMAGE} ${language}
    `;

    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        // Exit code 124 → timeout from GNU timeout (REAL TLE)
        if (err.code === 124) {
          return resolve({ verdict: "TLE" });
        }

        // Compilation error or runtime error
        return resolve({
          verdict: "RUNTIME_ERROR",
          stderr: stderr || err.message,
        });
      }

      resolve({
        verdict: "OK",
        stdout,
        stderr,
      });
    });
  });
};

module.exports = { runDocker };
