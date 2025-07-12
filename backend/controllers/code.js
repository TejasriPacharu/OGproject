const { cppExecution, cppTestCases } = require("../services/cpp.js");
const { generateFile} = require("../services/generateFile");
const { generateInputFile } = require("../services/generateInputFile");
const { analyzeCode } = require("../services/ai");
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
        
    
        let verdict;
        let status;

        for (let i = 0; i < testcases.length; i++) {
            const inputPath = await generateInputFile(testcases[i].input);
            const outputPath = testcases[i].output;

            if (language === "cpp") {
                const timeLimit = problemData.timelimit || 5; 
                output = await cppTestCases(filePath, inputPath, outputPath, timeLimit);
                status = "attempted";
            }
            console.log("OUTPUT: ",output);

            if(output === "accepted") {
                verdict = "Accepted";
            }
            if (output.stderr) {
                verdict = "Compilation Error";
                break;
            }


            if (output === "failed") {
                verdict = "Wrong Answer";
                break;
            }

            if( i === testcases.length - 1){
                status = "solved";
            }
        }
        
        const submission = await Submission.create({
            userId,
            problemId,
            language,
            code,
            output,
            verdict,
            status,
        });

        if(status === "solved"){
            const problemData = await Problem.findById(problemId);
            const solvedBy = problemData.solvedBy || [];
            solvedBy.push(userId);
            await Problem.updateOne({ _id: problemId }, { solvedBy });
        }
        
        return res.status(201).json({ message: "Submission successful!", submission });
    } catch (error) {
        
        const submission = await Submission.create({
            userId,
            problemId,
            language,
            code,
            output,
            verdict,
            status : "failed",
        });

        return res.status(500).json({message: "Submission Failed !", submission});
    }
};

const customCheck = async (req, res) => {
    let {problemId,language, code, input} = req.body;
    try {
        const problemData = await Problem.findById(problemId);
        const codeStubs = problemData.codeStubs;
        const filePath = await generateFile(language, code, codeStubs);
        const inputPath = await generateInputFile(input);
        const output = await cppExecution(filePath, inputPath, timelimit = 5);
        return res.json({ output });
    } catch (error) {
        return res.status(500).json(error);
    }
};

const analyzeCodeWithAI = async (req, res) => {
    let { language, code, problemId } = req.body;

    if (code === "") {
        return res.status(400).json({ message: "Code body cannot be empty!" });
    }

    try {
        // Get the problem description to provide context to Gemini
        const problemData = await Problem.findById(problemId);
        
        if (!problemData) {
            return res.status(404).json({ message: "Problem not found" });
        }

        // Use the Gemini API to analyze the code
        const analysis = await analyzeCode(
            code, 
            language, 
            problemData.description
        );
        console.log("=====================================");
        console.log("ANALYSIS: ",analysis);
        console.log("=====================================");

        return res.status(200).json({ 
            message: "Code analysis completed", 
            analysis 
        });
    } catch (error) {
        console.error("Error during code analysis:", error);
        return res.status(500).json({ 
            message: "Failed to analyze code", 
            error: error.message 
        });
    }
};

module.exports = {
    runCode,
    submitCode,
    customCheck,
    analyzeCodeWithAI
}