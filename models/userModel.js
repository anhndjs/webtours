const mongoose = require('mongoose');
const validator = require('validator');
// name, email, photo, pasword,passwordConfirm
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true,'Please tell us your name!']
    },
    email:{
        type: String,
        required:[true,'Please tell us your email address!'],
        unique: true,
        lowercase: true,
        validate:[validator.isEmail,'please provide a valid email']
    },
    photo: String,
    password:{
        type: String,
        required:[true,'please provide a password'],
        minlenghth:8,
        select: false
    },
    passwordConfirm: {
       type: String,
       required:[true,'please confirm your password'],
       validate:{
        // this only works on create and save !!!
        validator: function(el){
            return el === this.password;
        },
        message:'Passwords are not the same'
       }
    },
    passwordChangedAt: Date

});
userSchema.pre('save',async function(next){
    // only run this function if password
    if(!this.isModified('password')) return next();
    this.password =await bcrypt.hash(this.password,12)
    this.passwordConfirm = undefined;
    next();
});
userSchema.methods.correctPassword =async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword);
}
userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/100, 10);
        return JWTTimestamp < changedTimestamp;//100<200
    }
    return false;

}
const User = mongoose.model('User',userSchema)
module.exports = User;