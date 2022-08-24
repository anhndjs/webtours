const AppError = require("../utils/appError");

const handleCastErrorDB = err=>{
    const message = `invalid ${err.path}:{err.value}`;
    return new AppError(message,400)
}
const handleDuplicateFieldsDB = err =>{
    
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)
    console.log(value)
    const message = `duplicate field value: x pleas use another value `
    return new AppError(message,400)
}
const handleValidationErrorDB = err =>{
    const errors = Object.values(err.errors).map(el => el.message)
    const message = `invalid input data ${errors.join('. ')}`;
    return new AppError(message,400);
}
const sendErrorDev = (err,res)=>{
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}

const sendErrorProd = (err,res)=>{
    //operational, trusted error: send message to client
    if(err.isOperationError){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
           })
    // progaming or other unknown error: don't leak error details
    }else{
        //1) log error
        console.error('ERROR',err);
        res.status(500).json({
            status:'error',
            message: 'something went wrong!'
        });
    }
   
}
const handleJWTError = () => new AppError('invalid token. please log in again',401)
const handleJWExpiredError = () => new AppError('your token has expired! Please log in again.',401)
module.exports = (err,req, res, next)=>{
    console.log(err.stack);
    err.statusCode = err.statusCode ||500;
    err.status = err.status ||'error'
    if(process.env.NODE_ENV ==='development'){
        sendErrorDev(err,res);
    }else if(process.env.NODE_ENV ==='production'){
        let error = {...err} 
        if(error.name ==='CastError') error= handleCastErrorDB(error);
        if(error.name ===1000)error = handleDuplicateFieldsDB(error);
        if(error.name === 'validationError') error = handleValidationErrorDB(error);
        
        if(error.name === 'JsonWebTokenError') error = handleJWTError();
        if(error.name === 'TokenExpiredError') error = handleJWExpiredError();
        sendErrorProd(error,res);
    }
   
}