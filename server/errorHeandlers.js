const notFound = (err,req,res,next)=>{
    if(err.httpStatusCode === 404){
        res.status(404).send(err.message || "Data not Found")
    }
    next(err)
}

const badRequest = (err,req,res,next)=>{
    if(err.httpStatusCode === 400){
        res.status(400).send(err.message)
    }
    next(err)
}

const newDefinedError = (err,req,res,next)=>{
if(err.httpStatusCode === 456){
    res.status(456).send(err.message)
}
next(err)
}

const otherGenericError = (err,req,res,next)=>{
    if(err.httpStatusCode===500){
        res.status(500).send(err.message)
    }
    next(err)
    }

module.exports={
notFound,
badRequest,
newDefinedError,
otherGenericError
}














