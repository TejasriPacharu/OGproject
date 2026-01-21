const { createJobDir } = require("../services/createJobDir");
const { runDocker } = require("../services/dockerExecutor");

const { generateFile} = require("../services/generateFile");

const { analyzeCode } = require("../services/ai");
const { cleanupJobDirectory } = require("../services/fileCleanup");
const Problem = require("../models/Problem");
const Submission = require("../models/Submission");
const path = require("path");
const fs = require("fs");

const normalize = (str = "") => {
  return String(str)
    .replace(/\r?\n/g, "")
    .replace(/\s+/g, "")
    .replace(/[\[\]\(\)]/g, "")
    .replace(/,/g, "")
    .trim();
};



const runCode = async (req, res) => {
  const { language, code, problemId } = req.body;
  let jobDir;

  if (!code) {
    return res.status(400).json({ message: "Code empty" });
  }

  try {
    const problem = await Problem.findById(problemId);
    const job = createJobDir();
    jobDir = job.jobDir;

    const codeFile = language === "cpp" ? "solution.cpp" : "solution.py";
    fs.writeFileSync(path.join(jobDir, codeFile), code);

    fs.writeFileSync(
      path.join(jobDir, "input.txt"),
      problem.testCases[0].input
    );

    console.log("Job directory Created:", jobDir);

    const result = await runDocker({
      language,
      jobDir,
      timeLimit: problem.timelimit,
    });

    console.log("Docker execution result:", result);

    const outputPath = path.join(jobDir, "output.txt");
    const output = fs.existsSync(outputPath)
      ? fs.readFileSync(outputPath, "utf8")
      : "";

    return res.json({ output, verdict: result.verdict });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Execution failed" });
  } finally {
    if (jobDir) cleanupJobDirectory(jobDir);
  }
};


const submitCode = async (req, res) => {
  const { language, code, problemId, userId } = req.body;

  if (!code) {
    return res.status(400).json({ message: "Code body cannot be empty!" });
  }

  let jobDir;
  let verdict = "Accepted";
  let status = "attempted";
  let lastOutput = "";

  try {
    const problem = await Problem.findById(problemId);
    const testcases = problem.testCases;

    const job = createJobDir();
    jobDir = job.jobDir;

    const codeFile =
      language === "cpp" ? "solution.cpp" : "solution.py";
    fs.writeFileSync(path.join(jobDir, codeFile), code);

    for (let i = 0; i < testcases.length; i++) {
      fs.writeFileSync(
        path.join(jobDir, "input.txt"),
        testcases[i].input
      );

      const result = await runDocker({
        language,
        jobDir,
        timeLimit: problem.timelimit,
      });

      const outputPath = path.join(jobDir, "output.txt");
      lastOutput = fs.existsSync(outputPath)
        ? fs.readFileSync(outputPath, "utf8")
        : "";

      if (result.verdict === "TLE") {
        verdict = "Time Limit Exceeded";
        break;
      }

      if (
        normalize(lastOutput) !==
        normalize(testcases[i].output)
      ) {
        verdict = "Wrong Answer";
        break;
      }

      if (i === testcases.length - 1) {
        status = "solved";
      }
    }

    const submission = await Submission.create({
      userId,
      problemId,
      language,
      code,
      output: lastOutput,
      verdict,
      status,
    });

    if (status === "solved") {
      await Problem.updateOne(
        { _id: problemId },
        { $addToSet: { solvedBy: userId } }
      );
    }

    return res.status(201).json({
      message: "Submission successful!",
      submission,
    });

  } catch (err) {
    console.error(err);

    const submission = await Submission.create({
      userId,
      problemId,
      language,
      code,
      verdict: "Runtime Error",
      status: "failed",
    });

    return res.status(500).json({
      message: "Submission failed",
      submission,
    });

  } finally {
    if (jobDir) cleanupJobDirectory(jobDir);
  }
};

const customCheck = async (req, res) => {
  const { language, code, input } = req.body;

  let jobDir;

  try {
    const job = createJobDir();
    jobDir = job.jobDir;

    const codeFile =
      language === "cpp" ? "solution.cpp" : "solution.py";
    fs.writeFileSync(path.join(jobDir, codeFile), code);
    fs.writeFileSync(path.join(jobDir, "input.txt"), input);

    await runDocker({ language, jobDir, timeLimit: 5 });

    const output = fs.readFileSync(
      path.join(jobDir, "output.txt"),
      "utf8"
    );

    return res.json({ output });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Custom check failed" });
  } finally {
    if (jobDir) cleanupJobDirectory(jobDir);
  }
};

const analyzeCodeWithAI = async (req, res) => {
  const { language, code, problemId } = req.body;

  if (!code || code.trim() === "") {
    return res.status(400).json({
      message: "Code body cannot be empty!",
    });
  }

  try {
    // Fetch problem for context only (no stubs, no files)
    const problemData = await Problem.findById(problemId);

    if (!problemData) {
      return res.status(404).json({
        message: "Problem not found",
      });
    }

    // Perform AI analysis (NO filesystem, NO docker)
    const analysis = await analyzeCode(
      code,
      language,
      problemData.description || ""
    );

    console.log("=====================================");
    console.log("AI CODE ANALYSIS RESULT");
    console.log(analysis);
    console.log("=====================================");

    return res.status(200).json({
      message: "Code analysis completed",
      analysis,
    });

  } catch (error) {
    console.error("Error during code analysis:", error);

    return res.status(500).json({
      message: "Failed to analyze code",
      error: error.message,
    });
  }
};


module.exports = {
    runCode,
    submitCode,
    customCheck,
    analyzeCodeWithAI
};