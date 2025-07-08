const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const dirCodes = path.join(__dirname, "codes");

if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

const sanitizeJobId = (jobId) => {
  return `Class_${jobId.replace(/[^a-zA-Z0-9]/g, "_")}`;
};

// Parses C++ function signature into metadata
function parseCppFunctionSignature(signature) {

  const signatureLine = signature.split('\n')[0].trim();

  const regex = /([\w:<>]+)\s+(\w+)\s*\((.*)\)/;
  const match = signatureLine.match(regex);

  if (!match) {
    console.error("Failed to parse signature:", signatureLine);
    return null;
  }  

  const returnType = match[1];
  const functionName = match[2];
  const rawParams = match[3];

  const params = rawParams.split(',').map(p => p.trim()).filter(Boolean);

  const parameters = [];
  const parameterTypes = [];

  for (const param of params) {
    const [type, name] = param.replace("&", "").split(/\s+/).filter(Boolean);
    parameterTypes.push(type.includes("vector") ? "vector<int>" : type);
    parameters.push(name);
  }

  return { returnType, functionName, parameters, parameterTypes };
}

const generateFile = async (format, content, stubSignature) => {
  console.log("generateFile called with format:", format);
  console.log("generateFile called with content:", content);
  console.log("generateFile called with stubSignature:", stubSignature);
  const jobID = uuid();
  let filename;
  let finalContent = content;

  if (format === "cpp") {

    const cppSignature = stubSignature[0].cpp;
    console.log("cppSignature:", cppSignature);
    

    if (!cppSignature) {
      throw new Error("No C++ signature found in stubSignature");
    }

    const signatureLine = cppSignature.split('{')[0].trim();
    console.log("signatureLine:", signatureLine);

    const metadata = parseCppFunctionSignature(signatureLine);
    console.log("metadata:", metadata);

    if (!metadata) {
      throw new Error("Could not parse C++ function signature.");
    }

    const { returnType, functionName, parameters, parameterTypes } = metadata;
   

    const paramDeclarations = parameterTypes.map((type, index) => {
      const name = parameters[index];
      if (type === "vector<int>") {
        return `
    vector<int> ${name};
    if (getline(cin, line)) {
        line.erase(remove(line.begin(), line.end(), '['), line.end());
        line.erase(remove(line.begin(), line.end(), ']'), line.end());
        istringstream stream_${name}(line);
        string token_${name};
        while (getline(stream_${name}, token_${name}, ',')) {
            ${name}.push_back(stoi(token_${name}));
        }
    }`;
      } else if (type === "int") {
        return `
    int ${name};
    if (getline(cin, line)) {
        ${name} = stoi(line);
    }`;
      } else if (type === "string") {
        return `
    string ${name};
    if (getline(cin, line)) {
        ${name} = line;
    }`;
      } else {
        return `// Unsupported parameter type: ${type}`;
      }
    }).join("\n");
    
    const functionImplementation = `${content}`;

    const printResult = (returnType === "vector<int>") ? `
    cout << "[";
    for (size_t i = 0; i < result.size(); i++) {
        cout << result[i];
        if (i < result.size() - 1) cout << ",";
    }
    cout << "]" << endl;` : 
    (returnType === "double" || returnType === "float") ? `
    cout << fixed << setprecision(2) << result << endl;` : `
    cout << result << endl;`;


    finalContent = `#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
#include <cmath>
#include <queue>
#include <stack>
#include <sstream>
#include <iomanip>

using namespace std;

${functionImplementation}

int main() {
    string line;
${paramDeclarations}

    auto result = ${functionName}(${parameters.join(", ")});
    ${printResult}

    return 0;
}`;
  }

  if (format === "java") {
    const sanitizedJobId = sanitizeJobId(jobID);
    filename = `${sanitizedJobId}.${format}`;
  } else {
    filename = `${jobID}.${format}`;
  }

  const filePath = path.join(dirCodes, filename);
  await fs.writeFileSync(filePath, finalContent);
  return filePath;
};

module.exports = {
  generateFile,
};
