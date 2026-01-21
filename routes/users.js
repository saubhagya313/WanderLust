const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js");
const passport=require("passport"); //for authentication
const { saveRedirectUrl } = require("../middleware.js");



router.get("/Signup",(req,res)=>{
    res.render("users/signup.ejs")
})


router.post("/signup",wrapasync (async (req,res)=>{
    try{
 const {username,email,password}=req.body;
const newuser=new User({email,username});
const regUser=await User.register(newuser,password);
console.log(regUser);
req.login(regUser,function(err){
    if(err){
        next(err)
    }
    else{
        req.flash("success","User Signup Successful!");
        res.redirect("/Listings");
    }
})

    }
    catch(e){
        req.flash("error",e.message)
        res.redirect("/signup")
    }
}))


router.get("/Login",(req,res)=>{
    res.render("users/Login.ejs")
})

router.post("/Login", saveRedirectUrl,passport.authenticate('local', { failureRedirect: '/Login', failureFlash:true }) ,async(req,res)=>{
    req.flash("success","welcome to wanderlust!");
    console.log(res.locals.redirecturl)
   if(res.locals.redirecturl){
    res.redirect(res.locals.redirecturl);
   }
   else{
    res.redirect("/Listings");
   }
})


router.get("/Logout",(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            next(err)
        }
        req.flash("success","successfully logged out")
        res.redirect("/Listings");
    })
})

module.exports=router;