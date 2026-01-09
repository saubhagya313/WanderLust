const mongoose =require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./reviews.js")
const ListingSchema = new Schema({   //Listing Schema
    title:{
        type:String,
        required:true
    },
    description:String,
        image: {
    filename: {
        type: String,
        default: "default-image"
    },
    url: {
        type: String,
        default:
        "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    }
    },
    price : Number,
    location : String,
    country: String,
    reviews:[{
        type: Schema.Types.ObjectId,
        ref:"Review"
    }]
})

ListingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
await Review.deleteMany({_id : {$in:listing.reviews}})
    }
})

const list=mongoose.model("Listing",ListingSchema);  //creating a model
module.exports=list;  //exporting the model

