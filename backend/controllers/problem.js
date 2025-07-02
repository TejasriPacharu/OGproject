const Problem = require("../models/Problem");
const User = require("../models/User");


// retriveing all the problems -> GET
// get problem by ID  -> GET
// create a problem  -> POST
// edit a problem   -> PUT
// delete the problem  -> DELETE 

const getAllProblems = async (req, res) => {
    try{
        const problems = await Problem.find({});
        return res.status(200).json({problems});
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

const getProblemByID = async ( req, res) => {
    try {
       const problem = await Problem.findById(req.params.id);
       return res.status(200).json({problem});
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

const createProblem = async (req, res) => {
    try {
        const problem = await Problem.create(req.body);
        return res.status(201).json({problem});
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

const editProblem = async (req, res) => {
    const id = req.params.id;

    if(!id){
        return res.status(400).json({message: "Problem ID is required"});
    }

    const updateData = {};
    updateData.createdBy = req.user._id;

    try {
       let existingProblem = await Problem.findById(id);

       if(!existingProblem){
         return res.status(404).json({message: "Problem not found"})
       }

       if(testcases) updateData.testCases = testcases;
       if(slug) updateData.slug = slug;
       if(title) updateData.title = title;
       if(description) updateData.description = description;
       if(difficulty) updateData.difficulty = difficulty;
       if(tags) updateData.tags = tags;
       if(solvedBy) updateData.solvedBy = solvedBy;
       if(input) updateData.input = input;
       if(codeStubs) updateData.codeStubs = codeStubs;
       if(output) updateData.output = output;
       if(constraints) updateData.constraints = constraints;
       if(timelimit) updateData.timelimit = timelimit;

       existingProblem = await Problem.findByIdAndUpdate(id, updateData, {
        new: true,
      });
  
      return res
        .status(200)
        .json({ problem: existingProblem, message: "Problem updated!" });
    } catch (error) {
      console.error("Error editing problem:", error);
      return res
        .status(404)
        .json({ message: "Failed to update problem" });
    }
}


const deleteProblem = async (req, res) => {
    // delete based on id
    const id = req.params.id;
  
    if (!id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    try {
      await Problem.findByIdAndDelete(id);
  
      return res.status(StatusCodes.OK).json({ message: "Problem deleted!" });
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
    deleteProblem
}

