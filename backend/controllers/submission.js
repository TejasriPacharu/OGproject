const Submission = require("../models/Submission");
const Problem = require("../models/Problem");
const path = require('path');
const fs = require('fs');


// getAllSubmissions
// createSubmission
// getSubmissionById
// getUserAllSubmissions
// editSubmission
// deleteSubmission

const getAllSubmissions = async (req, res) => {
    try {
      const submissions = await Submission.find({});
      return res.status(200).json({ submissions });
    } catch (error) {
      return res
        .status(500)
        .json({ error: error.message });
    }
};



const createSubmission = async (req, res) => {
    try {
      const { userId, problemId, language, code, output, executionTime, verdict, status } =
        req.body;
  
      const submission = new Submission({
        userId,
        problemId,
        language,
        code,
        output,
        executionTime,
        verdict,
        status
      });
  
      await submission.save();
  
      return res.status(200).json({ submission });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to create submission",
        error: error.message,
      });
    }
};


const getSubmissionById = async (req, res) => {
    try {
      const submission = await Submission.findById(req.params.id);
      if (!submission) {
        return res.status(404).json({
          message: "Submission not found",
        });
      }
      return res.status(200).json({ submission });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to get submission",
        error: error.message,
      });
    }
};

const deleteSubmission = async (req, res) => {
    // delete based on id
    const id = req.params.id;
  
    if (!id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    try {
      await Submission.findByIdAndDelete(id);
  
      return res.status(200).json({ message: "Submission deleted!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
};

const getAllUserSubmissions = async (req, res) => {
    const userId = req.params.userId;
  
    if (!userId) {
      return res
        .status(404)
        .json({ message: "User Id is required!" });
    }
  
    try {
        const submissions = await Submission.find(
          { userId },
          "problemId language code output verdict status executionTime createdAt"
        )
          .sort({ createdAt: -1 })
          .exec();
        return res.status(200).json({ submissions });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
};

const getUserProblemSubmissions = async (req, res) => {
    const { userId, problemId } = req.params;
  
    if (!userId || !problemId) {
      return res
        .status(404)
        .json({ message: "User Id & Problem Id are required!" });
    }
  
    try {
        const submissions = await Submission.find(
          { userId, problemId },
          "language code output verdict status executionTime createdAt"
        )
          .sort({ createdAt: -1 })
          .exec();
        return res.status(200).json({ submissions });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
};

const editSubmission = async (req, res) => {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    try {
      const { userId, problemId, language, code, output, executionTime, verdict, status } =
        req.body;
  
      const submission = await Submission.findById(id);
  
      if (userId) submission.userId = userId;
      if (problemId) submission.problemId = problemId;
      if (language) submission.language = language;
      if (code) submission.code = code;
      if (output) submission.output = output;
      if (executionTime) submission.executionTime = executionTime;
      if (verdict) submission.verdict = verdict;
      if (status) submission.status = status;
  
      await submission.save();
  
      return res.status(200).json({ submission });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to edit submission",
        error: error.message,
      });
    }
};

module.exports = {
    getAllSubmissions,
    createSubmission,
    getSubmissionById,
    getAllUserSubmissions,
    getUserProblemSubmissions,
    editSubmission,
    deleteSubmission
};
