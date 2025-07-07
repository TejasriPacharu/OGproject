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
    throw new Error("Input is required");
  }

  const jobID = uuid();
  const input_filename = `${jobID}.txt`;
  const input_filePath = path.join(dirInputs, input_filename);
  
  try {
    // Process different input formats
    let formattedInput = "";
    
    if (typeof input === 'string') {
      // Handle string input like "nums1 = [1,3], nums2 = [2]"
      const arrayMatches = input.match(/\[.*?\]/g);
      if (arrayMatches) {
        formattedInput = arrayMatches.join('\n');
      } else {
        // If no arrays found, use the string as-is
        formattedInput = input;
      }
    } else if (Array.isArray(input)) {
      // Handle direct array input like [[1,3], [2]]
      formattedInput = input.map(arr => 
        Array.isArray(arr) ? `[${arr.join(',')}]` : arr
      ).join('\n');
    } else if (typeof input === 'object') {
      // Handle object input like {nums1: [1,3], nums2: [2]}
      formattedInput = Object.values(input).map(val =>
        Array.isArray(val) ? `[${val.join(',')}]` : val
      ).join('\n');
    } else {
      // Handle other cases (numbers, etc.)
      formattedInput = input.toString();
    }

    console.log("Formatted input:", formattedInput);
    
    await fs.writeFileSync(input_filePath, formattedInput);
    console.log(`Input file created at ${input_filePath}`);
    
    return input_filePath;
  } catch (err) {
    console.error("Error writing input file:", err);
    throw err;
  }
};

module.exports = {
  generateInputFile,
};