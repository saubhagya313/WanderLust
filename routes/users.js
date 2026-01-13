const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js");
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
})


router.post("/signup", wrapasync (async (req,res)=>{
    try{
 const {username,email,password}=req.body;
const newuser=new User({email,username});
const regUser=await User.register(newuser,password);
console.log(regUser);
req.flash("success","User Registered Successully!!");
res.redirect("/Listings");
    }
    catch(e){
        req.flash("error",e.message)
        res.redirect("/signup")
    }
}))
module.exports=router;