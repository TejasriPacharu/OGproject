const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const dirCodes = path.join(__dirname, "codes");

if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

const sanitizeJobId = (jobId) => {
  // Replace non-alphanumeric characters with underscores and prepend with "Class" to ensure a valid class name
  return `Class_${jobId.replace(/[^a-zA-Z0-9]/g, "_")}`;
};

const generateFile = async (format, content) => {
  const jobID = uuid();
  let filename;
  let finalContent = content;
  
  // Add necessary includes and main function for C++ submissions
  if (format === "cpp") {
    // Check if the content doesn't already have includes
    if (!content.includes("#include")) {
      finalContent = `#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
#include <cmath>
#include <queue>
#include <stack>
#include <sstream>

using namespace std;

${content}

// Main function to test the solution
int main() {
    // This is just a placeholder
    // The actual input will be provided via input file
    vector<int> nums;
    string line;
    int target;
    
    // Read input from stdin
    if (getline(cin, line)) {
        // Remove brackets
        line.erase(remove(line.begin(), line.end(), '['), line.end());
        line.erase(remove(line.begin(), line.end(), ']'), line.end());
        
        istringstream numStream(line);
        string numToken;
        
        // Parse comma-separated numbers
        while (getline(numStream, numToken, ',')) {
            nums.push_back(stoi(numToken));
        }
        
        // Read target value
        if (getline(cin, line)) {
            target = stoi(line);
        }
    }
    
    // Call the solution function
    auto result = twoSum(nums, target);
    
    // Print result
    cout << "[";
    for (size_t i = 0; i < result.size(); i++) {
        cout << result[i];
        if (i < result.size() - 1) cout << ",";
    }
    cout << "]" << endl;
    
    return 0;
}`;
    }
  }
  
  if (format === "java") {
    const sanitizedJobId = sanitizeJobId(jobID);
    filename = `${sanitizedJobId}.${format}`;
  } else filename = `${jobID}.${format}`;
  const filePath = path.join(dirCodes, filename);
  await fs.writeFileSync(filePath, finalContent);
  return filePath;
};

module.exports = {
  generateFile,
};