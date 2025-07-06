const { cppExecution, cppTestCases } = require("../services/cpp.js");
const { generateFile} = require("../services/generateFile");
const { generateInputFile } = require("../services/generateInputFile");
const fs = require('fs');
const path = require('path');
const Problem = require("../models/Problem");
const Submission = require("../models/Submission");

const runCode = async (req, res) => {
    let { language, code, problemId } = req.body;

    if (!code || !problemId) {
        return res.status(400).json({ message: "Required fields are missing!" });
    }

    try {
        const problemsPath = path.join(__dirname, '../data/problems.json');
        const problemsData = JSON.parse(fs.readFileSync(problemsPath, 'utf8'));
        
        const problemData = problemsData.find(p => p.id === problemId);
        const timelimit = problemData.timelimit;
        const input = problemData.testCases[0].input;

        const filePath = await generateFile(language, code);
        const inputPath = await generateInputFile(input || "");

        let output;

        if (language === "cpp") {
            output = await cppExecution(filePath, inputPath, timelimit);
        }

        return res.json({ filePath, inputPath, output });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message, stderr: error.stderr });
    }
};

const submitCode = async (req, res) => {
    let { language, code, problemId, userId } = req.body;

    if (!code || !problemId || !userId) {
        return res.status(400).json({ message: "Required fields are missing!" });
    }

    try {
        const filepath = await generateFile(language, code);
        let output;

        // Read problems.json file to get the test case input
        const problemsPath = path.join(__dirname, '../data/problems.json');
        const problemsData = JSON.parse(fs.readFileSync(problemsPath, 'utf8'));
        
        // Find the problem by ID in the problems.json
        const problemData = problemsData.find(p => p.id === problemId);
        const timelimit = problemData.timelimit
        
        console.log("Problem ID :", problemId);
        if (!problemData || !problemData.testCases || problemData.testCases.length === 0) {
            return res.status(404).json({ message: "No test cases found for this problem!" });
        }
        
        // Generate an input file from the test case
        const inputContent = problemData.testCases[0].input;
        console.log("Test case input content:", inputContent);
        const inputPath = await generateInputFile(inputContent);
        console.log("Generated input path:", inputPath);
        
        // Expected output from test case
        const expectedOutput = problemData.testCases[0].output;
        console.log("Expected output:", expectedOutput);

        if (language === "cpp") {
            console.log("Starting C++ test cases execution...");
            console.log("Timelimit:", timelimit);
            try {
                output = await cppTestCases(
                    filepath,
                    inputPath,
                    expectedOutput,
                    timelimit
                );
                console.log("C++ test cases completed with output:", output);
            } catch (error) {
                console.error("Error in cppTestCases:", error);
                output = "error";
            }
        }

        const submission = new Submission({
            code,
            language,
            output,
            problemId: problemData.id,
            userId,
        });
        await submission.save();

        // if (output.trim().toLowerCase() === "accepted") {
        //     if (!problemData.solvedBy.includes(userId)) {
        //         problemData.solvedBy.push(userId);
        //         await problemData.save();
        //     }
        // }

        res.json({ filepath, inputPath, output });

    } catch (err) {
        console.error("Error during code submission:", err);

        const submission = new Submission({
            userId,
            problemId: problemData.id,
            language,
            code,
            output: "failed",
        });
        await submission.save();

        return res.status(500).json({ stderr: err.message });
    }
};

module.exports = {
    runCode,
    submitCode,
}