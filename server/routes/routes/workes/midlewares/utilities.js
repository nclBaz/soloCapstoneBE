const jwt = require("jsonwebtoken")
const ProfileSchema = require("../profile/schema")

const createToken = async (user) =>{
try{
 const token = await generateToken({_id:user._id})
const newUser = await ProfileSchema.findById(user._id)
newUser.token=token
await newUser.save({ validateBeforeSave: false})
return {token}
}catch(err){
    console.log(err)
    throw new Error(err)
} 
}

const generateToken = (payload)=>
new Promise((res,rej)=>
jwt.sign(
  payload,
  process.env.SECRET_JWT, 
  {expiresIn:"25d"},
  (err,token)=>{
      if(err)rej(err);
      res(token)
  }

)
)




const verifyToken = (token)=>
new Promise((res,rej)=>{
 jwt.verify(token,process.env.SECRET_JWT,(err,credentials)=>{
     if(err){
         if(err.name == 'TokenExpiredError'){
             res()
         }else{
             rej(err)
         }
        }else{
             res(credentials)
         }
   })
    })


module.exports={
createToken,
verifyToken,
}

