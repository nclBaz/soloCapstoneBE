const express = require("express")
const postSchema = require("./schema")
const {User} = require("../Midlewares/middleware")
const q2m = require("query-to-mongo")
const profileSchema = require("../login/schema")
const cloudinary = require("cloudinary").v2 
const streamifier = require("streamifier")
const multer = require("multer")
const postRoute = express.Router()
const upload = multer({})
cloudinary.config({
    cloud_name: process.env.cloud_name,
  api_key:process.env.api_key,
  api_secret: process.env.api_secret
})

postRoute.get("/",User,async(req,res,next)=>{
    try{
        const allPosts = req.user._id
const query = q2m(req.query)
const post = await postSchema.find()
.find(query.criteria,query.options.fields)
.skip(query.options.skip)
.limit(query.options.limit)
.sort(query.options.sort);
if(post.length>0)
res.send(post)
else res.status(404).send("empty")

    }catch(err){
        next(err)
        console.log(err)
    }
})
postRoute.get("/singelPost/:_id", User, async(req,res,next)=>{
try{ 
const singelPost = req.params._id
const findPost = await postSchema.find({_id:singelPost})
console.log(findPost)
res.status(201).send(findPost)
}catch(err){
    next(err)
    console.log(err)
}
})
postRoute.post("/newPost",User,async(req,res,next)=>{    
try{
const user = req.user.id
const post = req.body
const newPost =  new postSchema({ ...post})
await newPost.save()

const addToProfile = await profileSchema.findById({_id:user })
const jobOffers = addToProfile.jobOffers
jobOffers.push(newPost._id)
await addToProfile.save({validateBeforeSave:false})

res.send("post has been sent")
}catch(err){
    next(err)
    console.log(err)
}
})
postRoute.post("/uploadImage/:_id",User,upload.single("image"),async(req,res,next)=>{
    try{
    if(req.file){
        const cloud_upload = cloudinary.uploader.upload_stream(
            {
                folder:'companyPostImages'
            },
            async(err,data)=>{
                if(!err){
                    const post = await postSchema.findByIdAndUpdate({_id:req.params._id})
                  post.image = data.secure_url
                 await post.save()
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
    
postRoute.put("/editPost/:_id",User,async(req,res,next)=>{
    try{
        console.log(req.body)
    const updatePost = await postSchema.findOneAndUpdate(req.params._id,req.body)
      if(updatePost)
        res.send("Post updated")
        else 
        res.status(404).send("not found")
    }catch(err){
        console.log(err)
        next(err)
    }
    })
postRoute.delete("/deletePost/:_id",User,async(req,res,next)=>{
try{
const _id = req.params._id
const remove = await postSchema.findOneAndDelete({_id:_id}) 
if(remove){
    res.send("Post is deleted")
}else{
    res.send("Post does not exist")
}
}catch(err){
    next(err)
    console.log(err)
}
})

module.exports=postRoute
