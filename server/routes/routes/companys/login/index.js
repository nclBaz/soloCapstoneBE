const express = require("express")
const companyData = require("./schema")

const companyRoute = express.Router()

companyRoute.get("/" , async(req,res,next)=>{
try{
const data = await companyData.find()
res.send(data)
}catch(err){
    next(err)
    console.log(err)
}
})
companyRoute.post("/",async(req,res,next)=>{
try{
    const data = req.body
    const hello = new companyData(data)
    await hello.save()
}catch(err){
    next(err)
    console.log(err)
}
})





module.exports= companyRoute