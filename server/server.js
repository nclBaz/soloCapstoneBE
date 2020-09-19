const express = require("express")
const {notFound, badRequest,newDefinedError,otherGenericError} = require("./errorHeandlers")
const cors = require("cors")
const login = require("./routes/routes/companys/login")
const port = process.env.PORT
const mongoose = require("mongoose")
const name = process.env.DATABASENAME
const password = process.env.PASSWORD
const database = process.env.DATABASE
const mainDatabase = process.env.MAINDATABASE
const cookieParser = require("cookie-parser")
const server = express()
server.use(cors())
server.use(express.json())
server.use(cookieParser())
server.use(notFound)
server.use(badRequest)
server.use(newDefinedError)
server.use(otherGenericError)
server.use("/login", login)


mongoose.connect(`mongodb+srv://${name}:${password}@${mainDatabase}.anpmf.mongodb.net/${database}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(
    server.listen(port, () => {
      console.log(`Server running on port : ${port}`);
    })
  )
  .catch((err) => console.log(err));

