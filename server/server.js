const express = require("express")
const {notFound, badRequest,newDefinedError,otherGenericError} = require("./errorHeandlers")
const cors = require("cors")
const companyLogin = require("./routes/routes/companys/login/index")
const port = process.env.PORT


const server = express()
server.use(cors())

server.use(notFound)
server.use(badRequest)
server.use(newDefinedError)
server.use(otherGenericError)
server.use("/login", companyLogin)



server.listen(port,()=>{
console.log("Server is rruning in port " , port)
})


