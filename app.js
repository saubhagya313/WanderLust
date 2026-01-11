const express= require("express");
const app=express();
const mongoose=require("mongoose");

const list=require("./models/listings.js");
const methodoverride=require("method-override");
const ejsmate=require("ejs-mate");

const expresserror=require("./utils/expresserror.js");   //express error  class require



const Exprouter=require("./routes/listing.js");  //its my express router
const reviewrouter=require("./routes/review.js") // its my review express router

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

app.listen(8082,()=>{
    console.log("port started");
})








async function main() {
    await mongoose.connect(url)
}



app.use("/Listings",Exprouter);  //express router when i get Listings i will use Listings
app.use("/Listings/:id/reviews",reviewrouter)  //review router 

app.get("/",(req,res)=>{
    res.send("hello !!! welocme")
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


