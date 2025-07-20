const { cppExecution, cppTestCases } = require("../services/cpp.js");
const { generateFile} = require("../services/generateFile");
const { generateInputFile } = require("../services/generateInputFile");
const { analyzeCode } = require("../services/ai");
const { cleanupJobFiles } = require("../services/fileCleanup");
const Problem = require("../models/Problem");
const Submission = require("../models/Submission");
const path = require("path");
const fs = require("fs");

const runCode = async (req, res) => {
    let { language, code, problemId} = req.body;
    console.log("runCode called with language:", language);
    console.log("runCode called with code:", code);
    console.log("runCode called with problemId:", problemId);
    
    let filePath, inputPath;

    if (code === "") {
        return res.status(400).json({ message: "Code body cannot be empty!" });
    }

    try {
        const problemData = await Problem.findById(problemId);
        const timelimit = problemData.timelimit;
        const input = problemData.testCases[0].input;
        const codeStubs = problemData.codeStubs;
        filePath = await generateFile(language, code, codeStubs);
        inputPath = await generateInputFile(input);
        
        // Extract jobIds from file paths for cleanup
        const codeJobId = path.basename(filePath).split(".")[0];
        const inputJobId = path.basename(inputPath).split(".")[0];
        
        let output;

        if (language === "cpp") {
            output = await cppExecution(filePath, inputPath, timelimit);
            output = output.replace(/\r?\n|\r/g, '');
            output.trim();
        }

        // Send response to client
        res.json({ filePath, inputPath, output });
        
        // Clean up files after sending response
        setTimeout(() => {
            // Clean up both code and input files
            cleanupJobFiles(codeJobId)
                .catch(err => console.error(`Error cleaning up code file ${codeJobId}:`, err));
                
            if (codeJobId !== inputJobId) {
                cleanupJobFiles(inputJobId)
                    .catch(err => console.error(`Error cleaning up input file ${inputJobId}:`, err));
            }
        }, 1000);
        
        return;
    } catch (error) {
        // If files were created but execution failed, still try to clean up
        if (filePath || inputPath) {
            setTimeout(() => {
                if (filePath) {
                    const codeJobId = path.basename(filePath).split(".")[0];
                    cleanupJobFiles(codeJobId)
                        .catch(err => console.error(`Error cleaning up code file ${codeJobId}:`, err));
                }
                
                if (inputPath) {
                    const inputJobId = path.basename(inputPath).split(".")[0];
                    cleanupJobFiles(inputJobId)
                        .catch(err => console.error(`Error cleaning up input file ${inputJobId}:`, err));
                }
            }, 1000);
        }
        
        return res.status(500).json(error);
    }
};

const submitCode = async (req, res) => {
    let { language, code, problemId, userId } = req.body;
    let filePath;
    let inputJobIds = [];

    if (code === "") {
        return res.status(400).json({ message: "Code body cannot be empty!" });
    }

    try {
        const problemData = await Problem.findById(problemId);
        const codeStubs = problemData.codeStubs;
        filePath = await generateFile(language, code, codeStubs);
        const codeJobId = path.basename(filePath).split(".")[0];
        
        let output;
        const testcases = problemData.testCases;
        let verdict;
        let status;

        for (let i = 0; i < testcases.length; i++) {
            const inputPath = await generateInputFile(testcases[i].input);
            // Extract and save each input job ID for cleanup
            const inputJobId = path.basename(inputPath).split(".")[0];
            inputJobIds.push(inputJobId);
            
            const outputPath = testcases[i].output;

            if (language === "cpp") {
                const timeLimit = problemData.timelimit || 5; 
                output = await cppTestCases(filePath, inputPath, outputPath, timeLimit);
                status = "attempted";
            }
            console.log("==================================");
            console.log("OUTPUT: ",output);
            console.log("==================================");

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

            if(i === testcases.length - 1){
                status = "solved";
            }
        }

        if(!output && status == "solved"){
            console.log("The code is correct and passed the testcases, making output to accepted")
            output = "Accepted";
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
        
        // Send response to the client first
        res.status(201).json({ message: "Submission successful!", submission });
        
        // Then clean up the files
        setTimeout(() => {
            // Clean up code file
            if (filePath) {
                const codeJobId = path.basename(filePath).split(".")[0];
                cleanupJobFiles(codeJobId)
                    .catch(err => console.error(`Error cleaning up code file ${codeJobId}:`, err));
            }
            
            // Clean up each input file
            inputJobIds.forEach(id => {
                cleanupJobFiles(id)
                    .catch(err => console.error(`Error cleaning up input file ${id}:`, err));
            });
        }, 1000);
        
        return;
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

        // Clean up any created files even on error
        setTimeout(() => {
            if (filePath) {
                const codeJobId = path.basename(filePath).split(".")[0];
                cleanupJobFiles(codeJobId)
                    .catch(err => console.error(`Error cleaning up code file ${codeJobId}:`, err));
            }
            
            // Clean up each input file
            inputJobIds.forEach(id => {
                cleanupJobFiles(id)
                    .catch(err => console.error(`Error cleaning up input file ${id}:`, err));
            });
        }, 1000);

        return res.status(500).json({message: "Submission Failed !", submission});
    }
};

const customCheck = async (req, res) => {
    let {problemId, language, code, input} = req.body;
    let filePath, inputPath;
    
    try {
        const problemData = await Problem.findById(problemId);
        const codeStubs = problemData.codeStubs;
        filePath = await generateFile(language, code, codeStubs);
        inputPath = await generateInputFile(input);
        
        // Extract job IDs for cleanup
        const codeJobId = path.basename(filePath).split(".")[0];
        const inputJobId = path.basename(inputPath).split(".")[0];
        
        const output = await cppExecution(filePath, inputPath, timelimit = 5);
        
        // Send response to client
        res.json({ output });
        
        // Clean up files after sending response
        setTimeout(() => {
            cleanupJobFiles(codeJobId)
                .catch(err => console.error(`Error cleaning up code file ${codeJobId}:`, err));
                
            // Always clean up input file separately
            cleanupJobFiles(inputJobId)
                .catch(err => console.error(`Error cleaning up input file ${inputJobId}:`, err));
        }, 1000);
        
        return;
    } catch (error) {
        // Clean up any created files even on error
        if (filePath || inputPath) {
            setTimeout(() => {
                if (filePath) {
                    const codeJobId = path.basename(filePath).split(".")[0];
                    cleanupJobFiles(codeJobId)
                        .catch(err => console.error(`Error cleaning up code file ${codeJobId}:`, err));
                }
                
                if (inputPath) {
                    const inputJobId = path.basename(inputPath).split(".")[0];
                    cleanupJobFiles(inputJobId)
                        .catch(err => console.error(`Error cleaning up input file ${inputJobId}:`, err));
                }
            }, 1000);
        }
        
        return res.status(500).json(error);
    }
};

const analyzeCodeWithAI = async (req, res) => {
    let { language, code, problemId } = req.body;
    let filePath;

    if (code === "") {
        return res.status(400).json({ message: "Code body cannot be empty!" });
    }

    try {
        // Get the problem description to provide context to Gemini
        const problemData = await Problem.findById(problemId);
        
        if (!problemData) {
            return res.status(404).json({ message: "Problem not found" });
        }
        
        // Generate a file for the code to provide context to analysis
        // This helps AI understand the structure better in some cases
        if (problemData.codeStubs) {
            filePath = await generateFile(language, code, problemData.codeStubs);
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

        // Send response to client
        res.status(200).json({ 
            message: "Code analysis completed", 
            analysis 
        });
        
        // Clean up created file if any
        if (filePath) {
            const codeJobId = path.basename(filePath).split(".")[0];
            setTimeout(() => {
                cleanupJobFiles(codeJobId)
                    .catch(err => console.error(`Error cleaning up file ${codeJobId} after analysis:`, err));
            }, 1000);
        }
        
        return;
    } catch (error) {
        console.error("Error during code analysis:", error);
        
        // Clean up created file if any even on error
        if (filePath) {
            const codeJobId = path.basename(filePath).split(".")[0];
            setTimeout(() => {
                cleanupJobFiles(codeJobId)
                    .catch(err => console.error(`Error cleaning up file ${codeJobId} after analysis error:`, err));
            }, 1000);
        }
        
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
};