const User = require('./../models/userModel')
const APIFetures = require('./../utils/apiFeatures')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const factory = require('./handlerFactory')

const filterObj = (obj, ...allowedFields)=>{
      const newObj = {};
      Object.keys(obj).forEach(el=>{
        if(allowedFields.includes(el)) newObj[el] = obj[el];
      })
      return newObj;
}

exports.deleteMe = catchAsync (async(req, res,next)=>{
    await User.findByIdAndUpdate(req.user.id,{active:false});
    res.status(200).json({
        status:'success',
        data:null
    })
})
exports.getMe = (req, res,next) => {
    req.params.id = req.user.id;
    next();
}
exports.updateMe= catchAsync(async (req,res,next) => {
    // create error if user 
    if(req.body.password || req.body.passwordConfirm){
        return next(new AppError('this route is not for password update.  please use/ updateMypassword',400));
    }
    //2) update user document
    const filteredBody = filterObj(req.body,'name','email') 
    const updateUser = await User.findByIdAndUpdate(req.user.id,filteredBody,{
        new: true,
        runValidators: true,
    })
    
    res.status(200).json({
        status: 'success',
        data:{
            user: updateUser
        }
    })
})
exports.getUser = factory.getOne(User);
exports.createUser = (req, res) => {
    res.status(500).json({
       status:'err',
       message :'this route is not defined ! plese use/signup instea'
    })
}
// do not update password with this
exports.getAllUsers = factory.getAll(User)
exports.updateUser = factory.updateOne(User)
exports.deleteUser =factory.deleteOne(User)

