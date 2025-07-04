const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const dirInputs = path.join(__dirname, "inputs");

if (!fs.existsSync(dirInputs)) {
  fs.mkdirSync(dirInputs, { recursive: true });
}

const generateInputFile = async (input) => {
  console.log("generateInputFile called with input:", input);
  
  if (!input) {
    console.warn("Warning: Empty input provided to generateInputFile");
    input = ""; // Set default empty string
  }
  
  const jobID = uuid();
  const input_filename = `${jobID}.txt`;
  const input_filePath = path.join(dirInputs, input_filename);
  
  try {
    await fs.writeFileSync(input_filePath, input);
    console.log(`Input file created at ${input_filePath} with content: ${input}`);
    
    // Verify file was written
    const content = fs.readFileSync(input_filePath, 'utf8');
    console.log(`Verified file content: ${content}`);
  } catch (err) {
    console.error("Error writing input file:", err);
  }
  
  return input_filePath;
};

module.exports = {
  generateInputFile,
};