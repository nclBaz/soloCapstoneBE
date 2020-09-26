const {Schema}  =  require("mongoose")
const mongoose = require("mongoose")

const schema = new Schema(
    {
schoolName:{
type:String,
required:true,
},
startDate:{
type:String,
required:true
},
endDate:{
    type:String,
    },
about:{
    type:String,
    required:true
},
description:{
type:String,
required:true,
minlength:[50,"Text should be at least 50 character long"]
},
skillsLearned:{
    type:String,
},
profileId:{
type:String,
}
}
)

const Model = mongoose.model("education", schema)
module.exports= Model