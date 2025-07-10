const router = require("express").Router();
const {
  runCode,
  submitCode,
  customCheck,
} = require("../controllers/code");


router.post("/run",runCode);
router.post("/submit",submitCode);
router.post("/custom-check",customCheck);

module.exports = router;