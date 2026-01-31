require("dotenv").config();

const express=require("express");
const router=express.Router();
const list=require("../models/listings.js");
const methodoverride=require("method-override");
const ejsmate=require("ejs-mate");
const wrapasync=require("../utils/wrapasync");  //wrap asynic file require
const expresserror=require("../utils/expresserror.js");   //express error  class require
const {ListingSchema,reviewSchema}=require("../schema.js");
const {islogged,canChange,validateschema}=require("../middleware.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({storage})

const listingController=require("../controller/listing.js");




//rest are havig different paths

router.get("/new", islogged,listingController.newformRender)

router.post("/add", islogged,upload.single("image"),validateschema,wrapasync(listingController.createNewListing))


// router.post("/add",upload.single("image"),(req,res)=>{
//     console.log(req.body);
//    console.log(req.file);
//     res.send(req.file);
    
// })


router.get("/", wrapasync(listingController.index))


router.route("/:id")  //here we deined path once so dont need to define it for all 
.put(islogged,canChange,upload.single("image"),validateschema,wrapasync(listingController.updateEdited))
.get(wrapasync(listingController.showDetails))


router.get("/:id/edit", islogged,canChange,wrapasync(listingController.editListing))


router.delete("/:id/del", canChange,wrapasync(listingController.deleteListing))


module.exports=router;