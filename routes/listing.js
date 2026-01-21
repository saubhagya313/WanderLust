const express=require("express");
const router=express.Router();
const list=require("../models/listings.js");
const methodoverride=require("method-override");
const ejsmate=require("ejs-mate");
const wrapasync=require("../utils/wrapasync");  //wrap asynic file require
const expresserror=require("../utils/expresserror.js");   //express error  class require
const {ListingSchema,reviewSchema}=require("../schema.js");
const {islogged,canChange}=require("../middleware.js");

const validateschema=(req,res,next)=>{
    let {error}= ListingSchema.validate(req.body);

   if(error){
    let errmsg=error.details.map((el)=>el.message).join(",");
    throw new expresserror(400,errmsg);
   }
   else{
    next();
   }
}

router.get("/", wrapasync( async (req,res)=>{  //index route
   const alllistings= await list.find({});
   res.render("listings/index.ejs",{alllistings});
   
}))

router.get("/new", islogged,(req,res)=>{    //create new listing
        res.render("listings/new.ejs");
})

router.get("/:id/edit", islogged,canChange,wrapasync( async (req,res)=>{  //edit request
    const {id}=req.params;
    const listing=await list.findById(id);
      if(!listing){
        req.flash("error","The Listing doesnt exist");
        return res.redirect("/Listings");
    }
    res.render("listings/edit.ejs",{listing});

}))



router.put("/:id",islogged,canChange,validateschema,wrapasync(async(req,res)=>{    //update the edited route

const listingdata=req.body;
if(listingdata.image && listingdata.image.trim()!=""){
     listingdata.image = {
        filename: "listingimage",
        url: req.body.image
    }
}
else{
    delete listingdata.image;
}
let {id}=req.params;




await list.findByIdAndUpdate(id,listingdata);
req.flash("success","Listing Updated!")
res.redirect(`/Listings/${id}`);
}))


router.get("/:id",  wrapasync( async(req,res)=>{   //seeing the details
//    console.log(req.params);
    const {id}=req.params;
    const listing = await list.findById(id)
    .populate({path:'reviews',
        populate:{
            path:'author'
        }
    })
    .populate('owner');
   
    if(!listing){
        req.flash("error","The Listing doesnt exist");
      return  res.redirect("/Listings");
    }
    res.render("listings/show.ejs",{listing});


}))




router.post("/add", validateschema,wrapasync( async (req,res,next)=>{  //adding the data inside the db for creating a new listing
    
    // if(Object.keys(req.body).length === 0){
    //     throw new expresserror(400,"give proper data");
    // }
    console.log(req.body);

    console.log("body.image",req.body.image);
    const listingdata=req.body;
   
    if (req.body.image && req.body.image.trim() !== "") {
    listingdata.image = {
        filename: "listingimage",
        url: req.body.image
    }}
  
    listingdata.owner=req.user._id;

    const newlisting=new list(listingdata);
    await newlisting.save();
    req.flash("success","new listing added !!");
    res.redirect("/Listings");
}
))


router.delete("/:id/del", canChange,wrapasync(async(req,res)=>{  //deleting the list
    const {id}=req.params;
    console.log(id);
   await list.findByIdAndDelete(id);
   req.flash("success","Listing Deleted");
   res.redirect("/Listings");
}))


module.exports=router;