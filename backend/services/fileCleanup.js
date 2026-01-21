const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const unlinkAsync = promisify(fs.unlink);
const readdirAsync = promisify(fs.readdir);
const statAsync = promisify(fs.stat);

// Use the exact same directory paths as in other service files
const dirCodes = path.join(__dirname, "codes");
const dirInputs = path.join(__dirname, "inputs");
const dirOutputs = path.join(__dirname, "outputs");


const JOBS_DIR = path.join(__dirname, "jobs");

if (!fs.existsSync(JOBS_DIR)) {
  fs.mkdirSync(JOBS_DIR, { recursive: true });
}


// Log directory paths during initialization for debugging
console.log("Cleanup initialized with directories:");
console.log(`  - Codes: ${dirCodes}`);
console.log(`  - Inputs: ${dirInputs}`);
console.log(`  - Outputs: ${dirOutputs}`);

/**
 * Clean up specific files by jobId
 * @param {string} jobId - The job ID used to identify related files
 * @param {boolean} preserveOutput - Whether to preserve the output file (default: false)
 */
const cleanupJobFiles = async (jobId, preserveOutput = false) => {
  try {
    console.log(`Cleaning up files for job: ${jobId}`);
    
    // Files to delete
    const filesToDelete = [];
    
    // Code files (.cpp, .out, etc)
    const codeFile = path.join(dirCodes, `${jobId}.cpp`);
    const outFile = path.join(dirCodes, `${jobId}.out`);
    
    // Input file
    const inputFile = path.join(dirInputs, `${jobId}.txt`);
    
    // Output files
    const outputFile = path.join(dirOutputs, `${jobId}_output.txt`);
    const expectedOutputFile = path.join(dirOutputs, `expected_${jobId}.txt`);
    
    // Add files to deletion list if they exist
    if (fs.existsSync(codeFile)) {
      filesToDelete.push(codeFile);
      console.log(`Found code file to delete: ${codeFile}`);
    } else {
      console.log(`Code file not found: ${codeFile}`);
    }
    
    if (fs.existsSync(outFile)) {
      filesToDelete.push(outFile);
      console.log(`Found out file to delete: ${outFile}`);
    } else {
      console.log(`Out file not found: ${outFile}`);
    }
    
    if (fs.existsSync(inputFile)) {
      filesToDelete.push(inputFile);
      console.log(`Found input file to delete: ${inputFile}`);
    } else {
      console.log(`Input file not found: ${inputFile}`);
    }
    
    // Only delete output files if not preserving output
    if (!preserveOutput) {
      if (fs.existsSync(outputFile)) {
        filesToDelete.push(outputFile);
        console.log(`Found output file to delete: ${outputFile}`);
      } else {
        console.log(`Output file not found: ${outputFile}`);
      }
      
      if (fs.existsSync(expectedOutputFile)) {
        filesToDelete.push(expectedOutputFile);
        console.log(`Found expected output file to delete: ${expectedOutputFile}`);
      } else {
        console.log(`Expected output file not found: ${expectedOutputFile}`);
      }
    }
    
    // Delete all collected files
    const deletionPromises = filesToDelete.map(file => {
      return unlinkAsync(file)
        .then(() => console.log(`Deleted: ${file}`))
        .catch(err => console.error(`Failed to delete ${file}: ${err.message}`));
    });
    
    await Promise.all(deletionPromises);
    console.log(`Cleanup completed for job: ${jobId}`);
    
  } catch (error) {
    console.error(`Error during cleanup for job ${jobId}:`, error);
  }
};

/**
 * Clean up old files from a directory based on age
 * @param {string} directory - Directory to clean
 * @param {number} maxAgeMs - Maximum age in milliseconds
 */
const cleanupOldFiles = async (directory, maxAgeMs = 24 * 60 * 60 * 1000) => {
  try {
    console.log(`Cleaning old files in ${directory}`);
    
    // Ensure directory exists
    if (!fs.existsSync(directory)) {
      console.log(`Directory ${directory} does not exist. Skipping cleanup.`);
      return;
    }
    
    const now = Date.now();
    const files = await readdirAsync(directory);
    
    for (const file of files) {
      const filePath = path.join(directory, file);
      const stats = await statAsync(filePath);
      const fileAge = now - stats.mtime.getTime();
      
      // Delete files older than maxAgeMs
      if (fileAge > maxAgeMs) {
        try {
          await unlinkAsync(filePath);
          console.log(`Deleted old file: ${filePath} (age: ${Math.round(fileAge / 60000)} minutes)`);
        } catch (err) {
          console.error(`Failed to delete old file ${filePath}: ${err.message}`);
        }
      }
    }
    
    console.log(`Finished cleaning old files in ${directory}`);
  } catch (error) {
    console.error(`Error cleaning old files in ${directory}:`, error);
  }
};

/**
 * Clean up all temporary directories
 * @param {number} maxAgeMs - Maximum age in milliseconds
 */
const cleanupAllDirectories = async (maxAgeMs = 24 * 60 * 60 * 1000) => {
  await Promise.all([
    cleanupOldFiles(dirCodes, maxAgeMs),
    cleanupOldFiles(dirInputs, maxAgeMs),
    cleanupOldFiles(dirOutputs, maxAgeMs)
  ]);
  console.log('Finished cleaning all directories');
};

/**
 * Clean up an entire job directory (Docker-based execution)
 * @param {string} jobDir - Absolute path to job directory
 */
const cleanupJobDirectory = async (jobDir) => {
  try {
    if (!jobDir) return;

    if (fs.existsSync(jobDir)) {
      await fs.promises.rm(jobDir, {
        recursive: true,
        force: true,
      });
      console.log(`Deleted job directory: ${jobDir}`);
    } else {
      console.log(`Job directory not found: ${jobDir}`);
    }
  } catch (error) {
    console.error(`Failed to delete job directory ${jobDir}:`, error);
  }
};


module.exports = {
  cleanupJobFiles,
  cleanupOldFiles,
  cleanupAllDirectories,
  cleanupJobDirectory
};


