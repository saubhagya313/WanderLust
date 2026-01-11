const express=require("express");
const  router=express.Router({ mergeParams: true })
const list=require("../models/listings.js");
const {ListingSchema,reviewSchema}=require("../schema.js");
const review=require("../models/reviews.js"); 
const wrapasync=require("../utils/wrapasync");  //wrap asynic file require
const expresserror=require("../utils/expresserror.js");   //express error  class require

const validatereview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body.review);
    if(error){
     
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new expresserror(400,errmsg)
    }
    else{
        next();
    }
}




router.delete("/:reviewid",wrapasync(async(req,res)=>{
    const {id,reviewid}=req.params;
    await list.findByIdAndUpdate(id,{$pull:{reviews:reviewid}})
    await review.findByIdAndDelete(reviewid);
    res.redirect(`/Listings/${id}`)
}))


router.post("/",validatereview,async(req,res)=>{   //post route for the reviews

    const data=await list.findById(req.params.id);
    const newreview=new review(req.body.review);
   
   await data.reviews.push(newreview);  //cause i get the listing value in the data so  pushing the review using data

    await newreview.save();
    await data.save()
    console.log("success")
    res.redirect(`/Listings/${data._id}`)
   
})


module.exports=router;