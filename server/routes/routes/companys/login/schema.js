const {Schema} = require("mongoose")
const mongoose = require("mongoose")

const companySchema = new Schema({
companyName :{
    type:String,
    required:true,
    unique:true
},
name:{
type:String,
required:true
},
surname:{
type:String,
required:true,
},
email:{
    type:String,
    required:true,
    unique:true
},
phoneNumber:{
    type:Number,
    required:true,
    },
password:{
    type:String,
    required:true,
    minlength:{
        min:8 && "you password must be 8 or more character"
    }
}
},
{timestamps:true})
const Model = mongoose.model("companyLogin",companySchema )
module.exports = Model


