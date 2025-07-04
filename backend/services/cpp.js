const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

// Enhanced normalize function to handle various formatting differences
const normalize = (str) => {
  if (!str) return '';
  // Convert to string if not already
  const strValue = String(str);
  // Remove all whitespace, brackets and special characters to compare just the numbers
  return strValue
    .replace(/\r\n/g, "\n")
    .replace(/\s+/g, "")
    .replace(/\[|\]/g, "")  // Remove square brackets
    .trim();
};

const cppExecution = (filepath, inputPath, timelimit) => {
    const jobId = path.basename(filepath).split(".")[0];
    const outPath = path.join(path.dirname(filepath), `${jobId}.out`);
  
    return new Promise((resolve, reject) => {
      // Compile the C++ code
      exec(
        `g++ "${filepath}" -o "${outPath}"`,
        (compileError, stdout, stderr) => {
          if (compileError) {
            return reject({ error: compileError.message, stderr });
          } else if (stderr) {
            return reject({ stderr });
          } else {
            // Execute the compiled executable with time limit
            const execCommand = exec(
              `"${outPath}" < "${inputPath}"`,
              { timeout: timelimit * 1000 },
              (execError, execStdout, execStderr) => {
                if (execStderr) {
                  return reject({ stderr: execStderr });
                } else if (execError) {
                  if (execError.killed) {
                    return resolve("time limit exceeded");
                  }
                  return reject({ error: execError.message, stderr: execStderr });
                } else {
                  return resolve(execStdout);
                }
              }
            );
  
            // Kill the process if it exceeds the time limit
            setTimeout(() => {
              execCommand.kill();
            }, timelimit * 1000);
          }
        }
      );
    });
};

const cppTestCases = async (
    filePath,
    inputPath,
    expectedOutput,
    timelimit
  ) => {
    // Create a temporary file for the expected output
    const outputDir = path.join(__dirname, "outputs");
    const expectedOutputFile = path.join(outputDir, `expected_${path.basename(filePath, ".cpp")}.txt`);
    
    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write the expected output to a file
    await fs.promises.writeFile(expectedOutputFile, expectedOutput);
  
    const jobId = path.basename(filePath).split(".")[0];
    const codeOutputPath = path.join(outputPath, `${jobId}_output.txt`);
    const outPath = path.join(path.dirname(filePath), `${jobId}.out`);
  
    console.log(`Running test case for ${filePath}`);
    console.log(`Input file path: ${inputPath}`);
    console.log(`Expected output: ${expectedOutput}`);
    
    // Verify input file contents
    try {
      const inputContent = await fs.promises.readFile(inputPath, 'utf8');
      console.log("Input file content:", inputContent);
    } catch (err) {
      console.error("Error reading input file:", err);
    }
    
    return new Promise((resolve, reject) => {
      const execCommand = exec(
        `g++ "${filePath}" -o "${outPath}" && "${outPath}" < "${inputPath}" > "${codeOutputPath}"`,
        { timeout: timelimit * 1000 },
        async (error, stdout, stderr) => {
          if (stderr) {
            console.error("Compilation or execution stderr:", stderr);
            return reject(stderr);
          } else if (error) {
            console.error("Execution error:", error);
            if (error.killed) {
              return resolve("time limit exceeded");
            }
            return reject({ error, stderr });
          }
  
          try {
            const generatedOutput = await fs.promises.readFile(
              codeOutputPath,
              "utf8"
            );
            
            // Log values for debugging
            console.log("Generated output:", generatedOutput);
            console.log("Expected output:", expectedOutput);
            console.log("Normalized generated:", normalize(generatedOutput));
            console.log("Normalized expected:", normalize(expectedOutput));
            
            // More flexible comparison that focuses on the numeric content
            const normalizedGenerated = normalize(generatedOutput);
            const normalizedExpected = normalize(expectedOutput);
            
            if (normalizedGenerated === normalizedExpected) {
              console.log("Test passed! Outputs match after normalization");
              resolve("accepted");
            } else {
              console.log("Test failed. Outputs don't match after normalization");
              resolve("failed");
            }
          } catch (readError) {
            console.error("Error reading output file:", readError);
            reject(readError);
          }
        }
      );
  
      setTimeout(() => {
        execCommand.kill();
      }, timelimit * 1000);
    });
  };
  
  module.exports = {
    cppExecution,
    cppTestCases,
  };
