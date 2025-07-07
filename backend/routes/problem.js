const {
    getAllProblems,
    getProblemByID,
    createProblem,
    editProblemByID,
    deleteProblem,
} = require("../controllers/problem");

const router = require("express").Router();

router.route("/")
      .get(getAllProblems)
      .post(createProblem)

router.route("/:id")
      .get(getProblemByID)
      .put(editProblemByID)
      .delete(deleteProblem)


module.exports = router;