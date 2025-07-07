const Problem = require("../models/Problem");
const User = require("../models/User");

// retrieving all the problems -> GET
const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find({});

    return res.status(200).json({ problems });
  } catch (error) {
    console.error('Error getting all problems:', error);
    return res.status(500).json({ message: error.message });
  }
};

const getProblemByID = async (req, res) => {
    try {
       const id = req.params.id;
       const problem = await Problem.findById(id);
       
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
            const { slug,title, description, difficulty, tags, solvedBy, input, codeStubs, output, constraints, timelimit, createdBy, testCases } =
              req.body;
        
            const problem = new Problem({
              slug,
              title,
              description,
              difficulty,
              tags,
              solvedBy,
              input,
              codeStubs,
              output,
              constraints,
              timelimit,
              createdBy,
              testCases
            });
        
            await problem.save();
        
            return res.status(200).json({ problem });
          } catch (error) {
            return res.status(500).json({
              message: "Failed to create problem",
              error: error.message,
            });
          }
}

const editProblemByID = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "Problem ID is required" });
  }

  try {
    const updatedProblem = await Problem.findByIdAndUpdate(id, req.body, {
      new: true,           // return updated doc
      runValidators: true  // ensure validation
    });

    if (!updatedProblem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    return res.status(200).json({ problem: updatedProblem });
  } catch (error) {
    console.error('Error editing problem:', error);
    return res.status(500).json({ message: error.message });
  }
};


const deleteProblem = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "Problem ID is required" });
  }

  try {
    const deleted = await Problem.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Problem not found" });
    }

    return res.status(200).json({ message: "Problem deleted successfully." });
  } catch (error) {
    console.error("Error deleting problem:", error);
    return res.status(500).json({ message: error.message });
  }
};


module.exports = {
    getAllProblems,
    getProblemByID,
    createProblem,
    editProblemByID,
    deleteProblem
}
