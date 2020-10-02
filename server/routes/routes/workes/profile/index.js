const express = require("express")
const schema = require("./schema")
const q2m = require("query-to-mongo")
const {User} = require("../midlewares/middleware")
const {createToken} = require("../midlewares/utilities")
const allCompanies =  require("../../companies/login")
const companiesPost = require("../../companies/post")
const passport = require("passport")
const workersRoute = express.Router()
const cloudinary = require("cloudinary").v2 
const streamifier = require("streamifier")
const multer = require("multer")

const upload = multer({})
cloudinary.config({
    cloud_name: process.env.cloud_name,
  api_key:process.env.api_key,
  api_secret: process.env.api_secret
})



workersRoute.get("/allProfiles",User,async(req,res,next)=>{
try{
const query = q2m(req.query)
const allProfiles = await schema().populate('skills').populate('education').populate('workExperience')
.find(query.criteria,query.options.fields)
.skip(query.options.skip)
.limit(query.options.limit)
.sort(query.options.sort)
if(allProfiles.length>0)
res.send(allProfiles)
else
res.status(404).send("the profiles doesn't exist")
}catch(error){
    next(error)
    console.log(error)
}
})


workersRoute.get("/allCompanies",User,async(req,res,next)=>{
try{
const query = q2m(req.query)
const allCompanies = await allCompanies().populate('jobOffers')
.find(query.criteria,query.options.fields)
.skip(query.options.skip)
.limit(query.options.limit)
.sort(query.options.sort)
if(allCompanies.length>0)
res.send(allCompanies)
else
res.send("THe companies does not exist")
}catch(error){
    next(error)
    console.log(error)
}
})

workersRoute.get("/singleProfile/:_id",User,async(req,res,next)=>{
try{
const _id = req.params._id
const profile = await schema.findById({_id:_id}).populate('workExperience')
.populate('education')
.populate('skills')
if(profile)
    res.send(profile)
else
res.status(404).send("Profile does not exist")
}catch(error){
    next(error)
    console.log(error)
}
})
workersRoute.get("/profile",User,async(req,res,next)=>{
try{
    const user = req.user
res.send(user)
}catch(err){
    next(err)
    console.log(err)
}
})
workersRoute.post("/uploadImage",User,upload.single("image"),async(req,res,next)=>{
    try{
    if(req.file){
        const cloud_upload = cloudinary.uploader.upload_stream(
            {
                folder:'workersImage'
            },
            async(err,data)=>{
                if(!err){
                    req.user.image = data.secure_url
                 await req.user.save({ validateBeforeSave: false })
                res.status(201).send("image is aded")
                }
            }
        )
        streamifier.createReadStream(req.file.buffer).pipe(cloud_upload)
    
    }else{
        const err = new Error()
        err.httpStatusCode = 400
        err.message= ' image is missing';
    next(err)
    }
    }catch(error){
        next(error)
        console.log(error)
    }

})


workersRoute.put("/edit",User,async(req,res,next)=>{
try{
delete req.body.email
const edit = Object.keys(req.body)
edit.forEach((edit)=>(req.user[edit]=req.body[edit]))
await req.user.save({validateBeforeSave:false})
res.send(req.user)
}catch{
    next(err)
    console.log(err)
}
})

workersRoute.delete("/delete",User,async(req,res,next)=>{
try{
    const _id = req.user._id
await schema.findByIdAndDelete({_id:_id})
res.send("Deleted")
}catch{
    next(err)
    console.log(err)
}
})





workersRoute.post("/login",async(req,res,next)=>{
try{
const {email,password} = req.body
console.log(email,"hellllloooooooo")
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
    next(err)
    console.log(err)
}
})

workersRoute.post("/register",async(req,res,next)=>{
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
workersRoute.get('/auth/linkedin', passport.authenticate('linkedin',{ state: 'SOME STATE'  }));

workersRoute.get(
  '/auth/linkedin/callback',
  passport.authenticate('linkedin', { failureRedirect: '/login' }),
  async (req, res, next) => {
    try {
        console.log("hellllo im here")
          const token = req.user.token;

      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
      res.send("helllo welcome")

    //   res.writeHead(301, {
    //     Location:
    //       process.env.FRONTEND_URL + '/profiles/me?' + req.user.username,
    //   });
      res.end();
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);






module.exports=workersRoute


