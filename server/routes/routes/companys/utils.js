const jwt = require("jsonwebtoken")
const ProfileSchema = require("./login/schema")

const createToken = async (user) =>{
try{
const token = await generateToken({id:user._id})
const user = await ProfileSchema.findById(user._id)
user.token=token
await user.save()
return {token}
}catch(err){
    console.log(err)
    throw new Error(err)
}
}

const generateToken = (payload)=>{
new Promise((res,rej)=>{
jwt.sign(
  payload,
  process.env.SECRET_JWT,
  {expiresIn:"1d"},
  (err,token)=>{
      if(err)rej(err);
      res(token)
  }

)
})


}

const verifyToken = (token)=>{
new Promise((res,rej)=>{
 jwt.verify(token,process.env.SECRET_JWT,(err,credentials)=>{
     if(err){
         if(err.name==='TokenExpiredError'){
             res()
         }else{
             rej(err)
         }
        }else{
             res(credentials)
         }
   })
    })
}

module.exports={
createToken,
verifyToken,
}

