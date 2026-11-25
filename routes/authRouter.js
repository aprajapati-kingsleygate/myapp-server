const express = require("express");
const router = express.Router();

router.get("/",(req,res)=>{
    console.log("You are  at auth routes!")
    res.send("You are  at auth routes!")
})

module.exports = router;