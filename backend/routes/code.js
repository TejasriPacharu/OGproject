const router = require("express").Router();
const {
  runCode,
  submitCode,
  customCheck,
  analyzeCodeWithAI
} = require("../controllers/code");


router.post("/run",runCode);
router.post("/submit",submitCode);
router.post("/custom-check",customCheck);
router.post("/analyze", analyzeCodeWithAI);

module.exports = router;