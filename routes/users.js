const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js");
const passport=require("passport"); //for authentication
const { saveRedirectUrl } = require("../middleware.js");

const userController=require("../controller/users.js")

router.get("/Signup",userController.signupRender)



router.post("/signup",wrapasync (userController.signupUser))


router.get("/Login",userController.loginRender)

router.post("/Login", saveRedirectUrl,passport.authenticate('local', { failureRedirect: '/Login', failureFlash:true }) ,userController.loginUser)


router.get("/Logout",userController.logoutUser)

module.exports=router;