const {Schema} = require("mongoose")
const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
const companySchema = new Schema({
companyName:{
type:String,
required:true,
minlength:[4,"Company  name should be at least 4 character"]
},
name:{
type:String,
required:true,
minlength:[4,"name should be at least 4 character"]

},
surname:{
type:String,
required:true,
minlength:[4,"surname should be at least 4 character"]
},
email:{
    type:String,
     required:true,
validate:{
validator:async(value)=>{
    if(!validator.isEmail(value)){
        throw new Error("Email is invalid")
    }else{
        const uniqueEmail = await Model.findOne({email:value})
        if(uniqueEmail){
            throw new Error ("Email already exist")
        }
    }
}



}
    },
phoneNumber:{
    type:Number,
    required:true,
    minlength:[9,"number should be at least 9 character"]
    },
password:{
    type:String,
    required:true,
    minlength:[8,"password should be at least 8 character"]  
    },
token:{
    type:String
}
},

{timestamps:true}
)
const Model = mongoose.model('login',companySchema )
module.exports = Model


