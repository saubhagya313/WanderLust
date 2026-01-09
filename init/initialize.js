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
    await list.insertMany(initdata.data);
    console.log("database updated");
}
initdb()