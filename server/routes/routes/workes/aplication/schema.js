const {Schema} = require("mongoose")
const mongoose = require("mongoose")

const aplicationSchema =  new Schema({

userId:{
    type:String
},
postId:[{type:Schema.Types.ObjectId, ref:'companyposts'}],
answer:{
    type:String,
    default:"no answer",
}
})

const Model = mongoose.model("aplication",aplicationSchema)
module.exports=Model

