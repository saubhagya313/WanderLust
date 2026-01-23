const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js");
const passport=require("passport"); //for authentication
const { saveRedirectUrl } = require("../middleware.js");

const userController=require("../controller/users.js")

//router.route helps to combine same routes so we dont have to specify everytime

router.route("/Signup")
.get(userController.signupRender)
.post(wrapasync (userController.signupUser))


router.route("/Login")
.get(userController.loginRender)
.post(saveRedirectUrl,passport.authenticate('local', { failureRedirect: '/Login', failureFlash:true }) ,userController.loginUser)



router.get("/Logout",userController.logoutUser)

module.exports=router;