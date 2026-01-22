
const list=require("./models/listings.js")
const review=require("./models/reviews.js")
const {ListingSchema,reviewSchema}=require("./schema.js");


module.exports.islogged = async(req,res,next)=>{
  
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl
        console.log(req.session.redirectUrl)
        req.flash("error","plz logged in")
        return res.redirect("/Login")
    }
    next();

}


module.exports.saveRedirectUrl=(req,res,next)=>{
   if(req.session.redirectUrl){
        res.locals.redirecturl=req.session.redirectUrl;
   }
   next()
}

module.exports.canChange= async(req,res,next)=>{
        let {id}=req.params;

const listing= await list.findById(id);
if(!res.locals.user ||!listing.owner.equals(res.locals.user._id)){
    req.flash("error","you cant change ");
    return res.redirect(`/Listings/${id}`);
}
next()
}



//reviews
module.exports.canAuthor=async(req,res,next)=>{
    const {id,reviewid}=req.params;
    const data=await review.findById(reviewid);
    if(!data.author.equals(res.locals.user._id)){
        req.flash("error","you cant delete the comment");
      return  res.redirect(`/Listings/${id}`)
    }
    next();
}


module.exports.validateschema=(req,res,next)=>{
    let {error}= ListingSchema.validate(req.body);

   if(error){
    let errmsg=error.details.map((el)=>el.message).join(",");
    throw new expresserror(400,errmsg);
   }
   else{
    next();
   }
}


module.exports.validatereview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body.review);
    if(error){
     
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new expresserror(400,errmsg)
    }
    else{
        next();
    }
}
