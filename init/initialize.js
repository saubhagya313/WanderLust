const mongoose=require("mongoose");
const initdata=require("./data.js");
const list=require("../models/listings.js")



const url="mongodb://127.0.0.1:27017/Major_Project"

main().then(()=>{
    console.log("Db connected");
})
.catch((error)=>{
    console.log(error);
})
async function main() {
    await mongoose.connect(url)
}

async function initdb() {
    await list.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:'696fb0fb6c814d353f88a9ba'}))
    await list.insertMany(initdata.data);
    console.log("database updated");
}
initdb()