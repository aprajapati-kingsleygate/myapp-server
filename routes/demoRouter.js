const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Demo router is working!" });
});

router.get("/hello", (req, res) => {
  res.json({ message: "Hello from demo router!" });
});

module.exports = router;
