
const list=require("../models/listings.js")

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});




module.exports.index=async (req,res)=>{  //index route
   const alllistings= await list.find({});
   res.render("listings/index.ejs",{alllistings});
}
module.exports.newformRender=(req,res)=>{    //create new listing
        res.render("listings/new.ejs");
}
module.exports.editListing= async (req,res)=>{  //edit request
    const {id}=req.params;
    const listing=await list.findById(id);
    console.log("listingdata",listing.image.url);
   let imageurl=listing.image.url;
   imageurl=imageurl.replace("/upload","/upload/w_250")
   console.log("hello");
   console.log("url....",imageurl);

      if(!listing){
        req.flash("error","The Listing doesnt exist");
        return res.redirect("/Listings");
    }
    res.render("listings/edit.ejs",{listing,imageurl});

}

module.exports.updateEdited=async(req,res)=>{    //update the edited route

const listingdata=req.body;

console.log(req.file);


if(req.file){
    const {path,filename}=req.file;
    listingdata.image={
        url:path,
        filename:filename
    }
}

let {id}=req.params;


await list.findByIdAndUpdate(id,listingdata);
req.flash("success","Listing Updated!")
res.redirect(`/Listings/${id}`);
}


module.exports.showDetails=async(req,res)=>{   //seeing the details
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
}


module.exports.createNewListing=async (req,res,next)=>{  //adding the data inside the db for creating a new listing
    
   
    const forwadAct= await   geocodingClient.forwardGeocode({
    query: req.body.location,
    limit: 1
    })
  .send()
  
    



    const path=req.file.path;
    const filename=req.file.filename;
    console.log("body",req.body);
  
    const listingdata=new list(req.body);
    listingdata.image.url=path;
    listingdata.image.filename=filename;
    listingdata.owner=req.user._id;
    listingdata.geometry=forwadAct.body.features[0].geometry;  //adding the geometry inside the db
    const data=await listingdata.save();
    console.log(data);

   
    req.flash("success","new listing added !!");
    res.redirect("/Listings");
}

module.exports.deleteListing=async(req,res)=>{  //deleting the list
    const {id}=req.params;
    console.log(id);
   await list.findByIdAndDelete(id);
   req.flash("success","Listing Deleted");
   res.redirect("/Listings");
}