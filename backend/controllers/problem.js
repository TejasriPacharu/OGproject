const fs = require('fs');
const path = require('path');
const Problem = require("../models/Problem");
const User = require("../models/User");

// Helper function to read problems from JSON file
const getProblemsFromFile = () => {
  try {
    const problemsFilePath = path.join(__dirname, '../data/problems.json');
    const problemsData = fs.readFileSync(problemsFilePath, 'utf8');
    return JSON.parse(problemsData);
  } catch (error) {
    console.error('Error reading problems file:', error);
    return [];
  }
};

// Helper function to write problems to JSON file
const writeProblemsToFile = (problems) => {
  try {
    const problemsFilePath = path.join(__dirname, '../data/problems.json');
    const problemsData = JSON.stringify(problems, null, 2);
    fs.writeFileSync(problemsFilePath, problemsData);
  } catch (error) {
    console.error('Error writing problems file:', error);
  }
};

// retrieving all the problems -> GET
const getAllProblems = async (req, res) => {
    try{
        // Use file-based problems instead of MongoDB
        const problems = getProblemsFromFile();
        return res.status(200).json({problems});
    }catch(error){
        console.error('Error getting all problems:', error);
        return res.status(500).json({message: error.message});
    }
}

const getProblemByID = async (req, res) => {
    try {
       // Use file-based problems instead of MongoDB
       const problems = getProblemsFromFile();
       const problem = problems.find(p => p.id === req.params.id);
       
       if (!problem) {
         return res.status(404).json({message: 'Problem not found'});
       }
       
       return res.status(200).json(problem);
    }catch(error){
        console.error('Error getting problem by ID:', error);
        return res.status(500).json({message: error.message});
    }
}

const createProblem = async (req, res) => {
    try {
        // Use file-based problems instead of MongoDB
        const problems = getProblemsFromFile();
        const newProblem = req.body;
        problems.push(newProblem);
        writeProblemsToFile(problems);
        return res.status(201).json({problem: newProblem});
    }catch(error){
        console.error('Error creating problem:', error);
        return res.status(500).json({message: error.message});
    }
}

const editProblem = async (req, res) => {
    const id = req.params.id;

    if(!id){
        return res.status(400).json({message: "Problem ID is required"});
    }

    try {
       // Use file-based problems instead of MongoDB
       const problems = getProblemsFromFile();
       const problemIndex = problems.findIndex(p => p.id === id);
       
       if (problemIndex === -1) {
         return res.status(404).json({message: 'Problem not found'});
       }
       
       const updateData = req.body;
       problems[problemIndex] = { ...problems[problemIndex], ...updateData };
       writeProblemsToFile(problems);
       return res.status(200).json({problem: problems[problemIndex]});
    }catch(error){
        console.error('Error editing problem:', error);
        return res.status(500).json({message: error.message});
    }
}

const deleteProblem = async (req, res) => {
    // delete based on id
    const id = req.params.id;
  
    if (!id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    try {
       // Use file-based problems instead of MongoDB
       const problems = getProblemsFromFile();
       const problemIndex = problems.findIndex(p => p.id === id);
       
       if (problemIndex === -1) {
         return res.status(404).json({message: 'Problem not found'});
       }
       
       problems.splice(problemIndex, 1);
       writeProblemsToFile(problems);
       return res.status(200).json({message: "Problem deleted!"});
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
};

module.exports = {
    getAllProblems,
    getProblemByID,
    createProblem,
    editProblem,
    deleteProblem,
    getProblemsFromFile,
    writeProblemsToFile
}
