const express= require("express");
const app=express();
const mongoose=require("mongoose");

const list=require("./models/listings.js");
const methodoverride=require("method-override");
const ejsmate=require("ejs-mate");
const wrapasync=require("./utils/wrapasync");  //wrap asynic file require
const expresserror=require("./utils/expresserror.js");   //express error  class require
const {ListingSchema}=require("./schema.js");
const review=require("./models/reviews.js");


const path=require("path");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(methodoverride("_method"));
app.engine('ejs',ejsmate);
app.use(express.static(path.join(__dirname,"/public"))) //styling for all the files we need to server the static files inside the boilderplate.ejs

const url="mongodb://127.0.0.1:27017/Major_Project"

main().then(()=>{
    console.log("Db connected");
})
.catch((error)=>{
    console.log(error);
})



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



async function main() {
    await mongoose.connect(url)
}
app.listen(8082,()=>{
    console.log("port started");
})

app.get("/Listings", wrapasync( async (req,res)=>{  //index route
   const alllistings= await list.find({});
   res.render("listings/index.ejs",{alllistings});
   
}))

app.get("/Listing/new",(req,res)=>{    //create new listing
        res.render("listings/new.ejs");
})

app.get("/Listings/:id/edit",wrapasync( async (req,res)=>{  //edit request
    const {id}=req.params;
    const listing=await list.findById(id);
    res.render("listings/edit.ejs",{listing});

}))

app.put("/Listings/:id",validateschema,wrapasync(async(req,res)=>{    //update the edited route


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
console.log(req.body);


await list.findByIdAndUpdate(id,listingdata);
res.redirect(`/Listings/${id}`);
}))


app.get("/Listings/:id",  wrapasync( async(req,res)=>{   //seeing the details
//    console.log(req.params);
    const {id}=req.params;
    const listing = await list.findById(id);
    res.render("listings/show.ejs",{listing});


}))





app.post("/Listing/add", validateschema,wrapasync( async (req,res,next)=>{  //adding the data inside the db for creating a new listing
    
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
    
    const newlisting=new list(listingdata);
    await newlisting.save();

    res.redirect("/Listings");
}
))


app.delete("/Listings/:id/del", wrapasync(async(req,res)=>{  //deleting the list
    const {id}=req.params;
    console.log(id);
   await list.findByIdAndDelete(id);
   res.redirect("/Listings");
}))

app.post("/Listings/:id/reviews",async(req,res)=>{   //post route for the reviewsb 

     const data=await list.findById(req.params.id);
    const newreview=new review(req.body.review);
   await data.reviews.push(newreview);  //cause i get the listing value in the data so  pushing the review using data

    await newreview.save();
    await data.save()
    console.log("success")
    res.send('success');
   
})





app.all(/.*/,(req,res,next)=>{   //middleware to handle all the wrong routes
    next(new expresserror(404,"page not found"));
})





app.use((err,req,res,next)=>{      //error handler middle ware
    const{status=500,message="something went wrong"}=err;
    console.log(status,message);
    //res.status(status).send(message)
    res.status(status).render("error.ejs",{err});
})

app.get("/",(req,res)=>{
    res.send("hello !!! welocme")
})
