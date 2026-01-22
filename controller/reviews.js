const list=require("../models/listings.js")
const review=require("../models/reviews.js"); 
const expresserror=require("../utils/expresserror.js");  


module.exports.deleteReview=async(req,res)=>{    //review delete
    const {id,reviewid}=req.params;
    await list.findByIdAndUpdate(id,{$pull:{reviews:reviewid}})
    await review.findByIdAndDelete(reviewid);
    req.flash("success","Review deleted!")
    res.redirect(`/Listings/${id}`)
    
}

module.exports.postReview=async(req,res)=>{   //post route for the reviews

    const data=await list.findById(req.params.id);
   
    const newreview=new review(req.body.review);

   newreview.author=res.locals.user;
   await data.reviews.push(newreview);  //cause i get the listing value in the data so  pushing the review using data

    await newreview.save();
    await data.save()
    console.log("success")
    req.flash("success","Review posted!")
    res.redirect(`/Listings/${data._id}`)
   
}