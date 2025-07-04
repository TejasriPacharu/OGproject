const {
    getAllProblems,
    getProblemByID,
    createProblem,
    editProblem,
    deleteProblem,
} = require("../controllers/problem");

const router = require("express").Router();

router.route("/")
      .get(getAllProblems)
      .post(createProblem)

router.route("/:id")
      .get(getProblemByID)
      .put(editProblem)
      .delete(deleteProblem)

module.exports = router;