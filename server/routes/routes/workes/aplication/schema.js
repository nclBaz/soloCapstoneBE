const {Schema} = require("mongoose")
const mongoose = require("mongoose")

const aplicationSchema =  new Schema({

userId:{
    type:String
},
postId:{
    type:String
},
answer:{
    type:String
}
})

const Model = mongoose.model("aplication",aplicationSchema)
module.exports=Model

