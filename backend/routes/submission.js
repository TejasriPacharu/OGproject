const {
    getAllSubmissions,
    getSubmissionById,
    getAllUserSubmissions,
    getUserProblemSubmissions,
    createSubmission,
    editSubmission,
    deleteSubmission,
    submitCode,
    compileCode,
    runCode
} = require("../controllers/submission");
const { protect } = require("../middleware/auth");

const router = require("express").Router();

// Routes for submissions
router.route("/")
      .get(getAllSubmissions)
      .post(createSubmission);

// Routes for individual submissions
router.route("/:id")
      .get(getSubmissionById)
      .put(editSubmission)
      .delete(deleteSubmission);

// Routes for user submissions
router.route("/user/:userId")
      .get(protect, getAllUserSubmissions);

// Routes for user problem-specific submissions
router.route("/user/:userId/problem/:problemId")
      .get(protect, getUserProblemSubmissions);

module.exports = router;