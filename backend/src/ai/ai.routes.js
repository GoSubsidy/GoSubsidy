const router = require("express").Router();
const { getAdvice } = require("./aiController");

router.post("/recommend", getAdvice);

module.exports = router;
