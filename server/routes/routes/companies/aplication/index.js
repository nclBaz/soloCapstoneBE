const express = require("express")
const postSchema = require("../post/schema")
const aplicationSchema = require("../../workes/aplication/schema")
const {User} = require("../Midlewares/middleware")
const manageAplication = express.Router()
const sendEmail = require("@sendgrid/mail")

manageAplication.get("/allPost",User,async(req,res,next)=>{
try{
    const allPost = await postSchema.find({userID:req.user._id})
res.send(allPost)
}catch(error){
    next(error)
    console.log(error)
}


})



manageAplication.post("/accept",User,async(req,res,next)=>{
try{



}catch(err){
    next(err)
    console.log(err)
}




})

manageAplication.post("/sendEmail",User, async (req, res, next) => {
    try {
      sgMail.setApiKey(process.env.API_KEY_SENDGRID)
  
      const msg = {
        to: "riccardo.gulin@gmail.com",
        from: "test@example.com",
        subject: "Sending with Twilio SendGrid is Fun",
        text: "and easy to do anywhere, even with Node.js",
        html: "<strong>and easy to do anywhere, even with Node.js</strong>",
      }
  
      await sgMail.send(msg)
      res.send("sent")
    } catch (error) {
      next(error)
    }
  })



module.exports=manageAplication