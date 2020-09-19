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

companySchema.statics.findByCredentials = async(email,password)=>{

const user = await Model.findOne({email:email})
console.log(user)
if(!user){
    const err = new Error ("Email is not Correct ")
    err.httpStatusCode = 404
    throw err
}
const Match = await bcrypt.compare(password,user.password)
console.log(Match)
if(!Match){
    const err =  new Error ("Password is not Correct");
    err.httpStatusCode=401
    throw err
}else{
    return user
}
}
// companySchema.pre("save",async function(next){
//     const user = this
//     if(user.isModified('password')){
// user.password = awa(user.password, 8)
//     }
//     next()
// })

companySchema.methods.toJSON = function(){
let object = this.toObject()
// delete object.password,
// delete object.token,
delete object.__v


return object
}


const Model = mongoose.model('login',companySchema )
module.exports = Model


