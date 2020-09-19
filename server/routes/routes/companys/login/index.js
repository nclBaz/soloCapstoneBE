const express = require("express")
const schema = require("./schema")
const q2m = require("query-to-mongo")
const {User} = require("../midelware")
const {createToken} = require("../utils")
const { cookie } = require("request")

const companyRoute = express.Router()

companyRoute.get("/me",User, async(req,res,next)=>{
try{
const data = await schema.find()
res.send(data)
}catch(err){
    next(err)
    console.log(err)
}
})

companyRoute.post("/login", async(req,res,next)=>{
try{
    const {email,password} = req.body
const user = await schema.findByCredentials(email,password)
console.log(user,"userrrrrr")
if(user){
const token = await createToken(user)
console.log(token,"hellll")
res.cookie('token',token.token,{
httpOnly:true,
secure:true,
sameSite:'none'
})

}
}catch(err){
    console.log(err)
    next(err)
}
})
companyRoute.post("/register", async(req,res,next)=>{
try{
    const data = req.body
    console.log(req.body)
    const newData = new schema(data)
    await newData.save()
    res.send("data aded")
}catch(err){
    next(err)
    console.log(err)
}
})





module.exports= companyRoute