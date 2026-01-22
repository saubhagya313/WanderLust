const express=require("express");
const router=express.Router();
const list=require("../models/listings.js");
const methodoverride=require("method-override");
const ejsmate=require("ejs-mate");
const wrapasync=require("../utils/wrapasync");  //wrap asynic file require
const expresserror=require("../utils/expresserror.js");   //express error  class require
const {ListingSchema,reviewSchema}=require("../schema.js");
const {islogged,canChange,validateschema}=require("../middleware.js");


const listingController=require("../controller/listing.js");


router.get("/", wrapasync(listingController.index))

router.get("/new", islogged,listingController.newformRender)

router.get("/:id/edit", islogged,canChange,wrapasync(listingController.editListing))



router.put("/:id",islogged,canChange,validateschema,wrapasync(listingController.updateEdited))


router.get("/:id",  wrapasync(listingController.showDetails))




router.post("/add", validateschema,wrapasync(listingController.createNewListing))


router.delete("/:id/del", canChange,wrapasync(listingController.deleteListing))


module.exports=router;