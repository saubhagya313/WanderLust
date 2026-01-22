const express=require("express");
const  router=express.Router({ mergeParams: true })
const list=require("../models/listings.js");
const {ListingSchema,reviewSchema}=require("../schema.js");
const review=require("../models/reviews.js"); 
const wrapasync=require("../utils/wrapasync");  //wrap asynic file require
const expresserror=require("../utils/expresserror.js");   //express error  class require
const {islogged,canChange,canAuthor,validatereview}=require("../middleware.js");
const reviewController=require("../controller/reviews.js")




router.delete("/:reviewid",islogged,canAuthor,wrapasync(reviewController.deleteReview))


router.post("/",islogged,validatereview,reviewController.postReview)


module.exports=router;