const express = require("express")
const companyData = require("./schema")

const companyRoute = express.Router()

companyRoute.get("/all" , async(req,res,next)=>{
try{
const data = await companyData.find()
res.send(data)
}catch(err){
    next(err)
    console.log(err)
}
})
companyRoute.post("/register",async(req,res,next)=>{
try{
    const data = req.body
    console.log(req.body)
    const newData = new companyData(data)
    await newData.save()
    res.send("data aded")
}catch(err){
    next(err)
    console.log(err)
}
})





module.exports= companyRoute