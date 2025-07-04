const router = require("express").Router();
const {
  runCode,
  submitCode,
} = require("../controllers/code");


router.post("/run",runCode);
router.post("/submit",submitCode);

module.exports = router;