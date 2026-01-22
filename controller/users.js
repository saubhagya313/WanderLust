const User=require("../models/user.js");


module.exports.signupRender=(req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.signupUser=async (req,res)=>{
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
}


module.exports.loginRender=(req,res)=>{
    res.render("users/Login.ejs")
}

module.exports.loginUser=async(req,res)=>{
    req.flash("success","welcome to wanderlust!");
    console.log(res.locals.redirecturl)
   if(res.locals.redirecturl){
    res.redirect(res.locals.redirecturl);
   }
   else{
    res.redirect("/Listings");
   }
}


module.exports.logoutUser=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            next(err)
        }
        req.flash("success","successfully logged out")
        res.redirect("/Listings");
    })
}