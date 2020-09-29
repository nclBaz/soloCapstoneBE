const {Schema}  =  require("mongoose")
const mongoose = require("mongoose")

const schema = new Schema(
    {
skillName:{
type:String,
required:true,
},
description:{
type:String,
required:true,
minlength:[50,"Text should be at least 50 character long"]
},
profileId:{
type:String,
}
}
)


const Model = mongoose.model("skills", schema)
module.exports= Model