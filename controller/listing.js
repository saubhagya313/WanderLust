
const list=require("../models/listings.js")





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
      if(!listing){
        req.flash("error","The Listing doesnt exist");
        return res.redirect("/Listings");
    }
    res.render("listings/edit.ejs",{listing});

}

module.exports.updateEdited=async(req,res)=>{    //update the edited route

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

module.exports.deleteListing=async(req,res)=>{  //deleting the list
    const {id}=req.params;
    console.log(id);
   await list.findByIdAndDelete(id);
   req.flash("success","Listing Deleted");
   res.redirect("/Listings");
}