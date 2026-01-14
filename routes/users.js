const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js");
const passport=require("passport"); //for authentication



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


router.get("/Login",(req,res)=>{
    res.render("users/Login.ejs")
})

router.post("/Login", passport.authenticate('local', { failureRedirect: '/Login', failureFlash:true }) ,async(req,res)=>{
    req.flash("success","welcome to wanderlust!");
    res.redirect("/Listings");
})


module.exports=router;