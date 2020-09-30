const express = require("express")
const schema = require("./schema")
const q2m = require("query-to-mongo")
const {User} = require("../Midlewares/middleware")
const {createToken} = require("../Midlewares/utilities")
const postSchema = require("../post/schema")
const passport = require("passport")
const multer = require("multer")
const fs = require("fs-extra")
const port = process.env.PORT
const upload = multer()
const path = require("path")
const companyRoute = express.Router()


companyRoute.get("/profile",User, async(req,res,next)=>{
try{
   const data = req.user._id
   const profile = await schema.find({_id:data}).populate('jobOffers')
   res.send(profile)
}catch(err){
    next(err)
    console.log(err)
}
})
companyRoute.get("/allProfiles",User,async(req,res,next)=>{
try{
    const allProfiles = await schema.find().populate('jobOffers')
res.send(allProfiles)

}catch(error){
    next(error)
    console.log(error)
}
})
companyRoute.post("/upload",User,upload.single("image"),async(req,res,next)=>{
try{
const image = path.join(__dirname,"../companyImage")
await fs.writeFile(
    path.join(
        image,
        req.user._id +
        req.file.originalname
    ),
    req.file.buffer,
    console.log(req.file.buffer)
);


const obj = {
image : fs.readFileSync(
    path.join(
        __dirname 
        +
         "/images/" 
         +
          req.user._id 
          +
          req.file.originalname
    )
)
}
const newImage = await schema.findByIdAndUpdate({_id:req.user._id, validateBeforeSave:false, obj})
res.send("image aded")

}catch(error){
    next(error)
    console.log(error)
}
})




companyRoute.put("/edit",User,async(req,res,next)=>{
try{
delete req.body.email
const edit = Object.keys(req.body)

edit.forEach((edit)=> (req.user[edit]= req.body[edit]))
await req.user.save({validateBeforeSave:false})
res.send(req.user)
}catch(err){
    console.log(err)
    next(err)
}
})


companyRoute.delete("/delete",User,async(req,res,next)=>{
try{
await schema.findByIdAndDelete({_id:req.user._id})
await postSchema.findByIdAndDelete({jobOffers:req.user._id})
res.send("deleted")
}catch(err){
    console.log(err)
    next(err)
}
})

companyRoute.post("/login", async(req,res,next)=>{
try{
    const {email,password} = req.body
  const user = await schema.findByCredentials(email,password)
if(user){
const token = await createToken(user)
res.cookie('token',token.token,{
httpOnly:true,
secure:true,
sameSite:'none'
})
res.send("loged in")
}
}catch(err){
    console.log(err)
    next(err)
}
})

companyRoute.post("/logout", User , async(req,res,next)=>{
try{
const user = req.user;
user.token='';
await user.save({validateBeforeSave:false})
res.cookie("nothing",user.token)
res.send("ok")  
}catch(err){
    console.log(err)
    next(err)
}
})


companyRoute.post("/register", async(req,res,next)=>{
try{
    const data = req.body
    const newData = new schema(data)
    await newData.save()
    res.send("new User is created")
}catch(err){
    next(err)
    console.log(err)
}
})


companyRoute.get('/auth/linkedin', passport.authenticate('linkedin'));

companyRoute.get(
  '/auth/linkedin/callback',
  passport.authenticate('linkedin', { failureRedirect: '/login' }),
  async (req, res, next) => {
    try {
      const token = req.user.token;

      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });

    //   res.writeHead(301, {
    //     Location:
    //     //   process.env.FRONTEND_URL + '/profiles/me?' + req.user.username,
    //   });
      res.end();
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);
module.exports= companyRoute