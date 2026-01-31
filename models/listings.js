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
    // filename: {
    //     type: String,
    //     default: "default-image"
    // },
    // url: {
    //     type: String,
    //     default:
    //     "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    // }
    url:String,
    filename:String
    },
    price : Number,
    location : String,
    country: String,
    reviews:[{
        type: Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
    ,
    geometry:{     //used this from mongoose geojson
          type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
    }
})

ListingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
await Review.deleteMany({_id : {$in:listing.reviews}})
    }
})

const list=mongoose.model("Listing",ListingSchema);  //creating a model
module.exports=list;  //exporting the model

