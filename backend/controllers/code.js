const { cppExecution, cppTestCases } = require("../services/cpp.js");
const { generateFile} = require("../services/generateFile");
const { generateInputFile } = require("../services/generateInputFile");
const Problem = require("../models/Problem");
const Submission = require("../models/Submission");
const path = require("path");
const fs = require("fs");

const runCode = async (req, res) => {
    let { language, code, problemId} = req.body;
    console.log("runCode called with language:", language);
    console.log("runCode called with code:", code);
    console.log("runCode called with problemId:", problemId);

    if (code === "") {
        return res.status(400).json({ message: "Code body cannot be empty!" });
    }

    try {
        const problemData = await Problem.findById(problemId);
        const timelimit = problemData.timelimit;
        const input = problemData.testCases[0].input;
        const codeStubs = problemData.codeStubs;
        const filePath = await generateFile(language, code, codeStubs);
        const inputPath = await generateInputFile(input);
        
        let output;

        if (language === "cpp") {
            output = await cppExecution(filePath, inputPath, timelimit);
            output = output.replace(/\r?\n|\r/g, '');
            output.trim();
        }

        return res.json({ filePath, inputPath, output });
    } catch (error) {
        return res.status(500).json(error);
    }
};

const submitCode = async (req, res) => {
    let { language, code, problemId, userId } = req.body;

    if (code === "") {
        return res.status(400).json({ message: "Code body cannot be empty!" });
    }

    try {
        const problemData = await Problem.findById(problemId);
        const codeStubs = problemData.codeStubs;
        const filePath = await generateFile(language, code, codeStubs);
        let output;

        
        const testcases = problemData.testCases;
        console.log("User ID : ", userId);
        console.log("Problem ID : ", problemId);
        console.log("Code : ", code);
        console.log("Language : ", language);
    
        let verdict;

        for (let i = 0; i < testcases.length; i++) {
            const inputPath = await generateInputFile(testcases[i].input);
            const outputPath = testcases[i].output;

            if (language === "cpp") {
                output = await cppTestCases(filePath, inputPath, outputPath, problemData.timelimit);
            }

            if (output.stderr) {
                verdict = "Compilation Error";
                break;
            }

            const expectedOutput = fs.readFileSync(testcases[i].output, "utf-8").trim();
            const actualOutput = fs.readFileSync(outputPath, "utf-8").trim();

            if (actualOutput !== expectedOutput) {
                verdict = "Wrong Answer";
                break;
            }

            fs.unlinkSync(outputPath);
        }
        const submission = await Submission.create({
            userId,
            problemId,
            code,
            language,
            verdict,
        });
        
        return res.status(201).json({ message: "Submission successful!", submission });
    } catch (error) {
        return res.status(500).json(error);
    }
};

module.exports = {
    runCode,
    submitCode,
}