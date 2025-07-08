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
    let formattedInput = "";

  if (typeof input === 'string') {
    // Case 1: Handle string inputs like "nums1 = [1,3], nums2 = [2]" or "[2,7,11,15], 9"
    const items = [];
    
    // Extract all arrays first (e.g., [1,3], [2])
    const arrayMatches = input.match(/\[[^\]]*\]/g) || [];
    items.push(...arrayMatches);
    
    // Extract standalone numbers not in arrays (e.g., 9 in "[...], 9")
    const remainingParts = input.replace(/\[[^\]]*\]/g, ''); // Remove arrays
    const numberMatches = remainingParts.match(/\b\d+\b/g) || [];
    items.push(...numberMatches);
    
    formattedInput = items.join('\n');
  } 
  else if (Array.isArray(input)) {
    // Case 2: Handle direct array input like [[1,3], [2]] or [[2,7,11,15], 9]
    formattedInput = input.map(item => 
      Array.isArray(item) ? `[${item.join(',')}]` : item
    ).join('\n');
  } 
  else if (typeof input === 'object' && input !== null) {
    // Case 3: Handle object input like {nums1: [1,3], nums2: [2]} or {nums: [2,7,11,15], target: 9}
    formattedInput = Object.values(input).map(val =>
      Array.isArray(val) ? `[${val.join(',')}]` : val
    ).join('\n');
  } 
  else {
    // Fallback: Convert to string
    formattedInput = String(input);
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