const express = require("express");
const router = express.Router();


router.get("/",(req,res)=>res.send("You are at user route"))
router.get("/register",(req,res)=>{
    res.send("User Registered success");
})

module.exports = router;