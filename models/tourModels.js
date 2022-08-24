const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const tourSchema = new mongoose.Schema({
    name:{
       type: String,
       required: [true,'a tour must have a name'],
       unique: true,
       trim: true,
       maxlength:[40,'a tour name must have less or equal then 40 characters'],
       minlength:[10,'a tour name must have more or equal then 10 charaters'],
      //  validate: [validator.isAlpha,'tour name must only ']
    },
    slug: String,
    duration:{
      type:Number,
      required: [true,'a tour must have a duration'],
    },
    maxGroupSize:{
    type: Number,
    required: [true,'a tour must have a groupt siZe']
    },
    difficulty:{
      type: String,
      required: [true,'a tour must have a difficulty'],
      enum:{
        values:['easy','medium','difficulty'],
        message:'Difficulty is either: easy, medium, difficult'
      }
    },
    ratingsAverage: {
    type: Number,
    default:  4.5,
    min:[1,'rating must be above 1.0'],
    max: [5,'rating must be below 5.0']
   },
   ratingsQuantity:{
    type: Number,
    default:0,  
   },
   price: {
    type: Number,
    required: [true,'a tour must have a price'],
    },
   priceDiscount: {
   type: Number,
   validate: {
    validator: function(val){
      return val < this.price;
       },
       message: 'discount price({VALUE}) should be below regular price'
   }
   },
   summary:{
    type: String,
    trim: true,
    required: [true,'a tour must have a description'],
   },
   description:{
    type: String,
    trim: true,
   },
   imageCover:{
      type: String,
      required: [true,'a tour must have a cover image']
   },
   images: [String],
   createAt : {
      type: Date,
      default: Date.now(),
      select: false
   },
   startDates:[Date],
   secretTour:{
      type: Boolean,
      default:false
   }
   },{
      toJSON: {virtuals: true},
      toObject: {virtuals: true}
   });
   tourSchema.virtual('durationWeeks').get(function (){
      return this.duration / 7
   })
   //document middi fware: runs before . save() and .create()
   tourSchema.pre('save',function (next){
     this.slug = slugify(this.name,{lower:true});
     next();
   })
   tourSchema.pre('save',function (next){
      console.log('will save document...')
      next();
   })
   // tourSchema.post('save',function (doc,next){
   //   console.log(doc);
   //   next();
   // })
   //query middleware
   tourSchema.pre(/^find/,function (next){
      this.find({secretTour:{$ne: true }})
      this.start = Date.now();
      next();
   })
   tourSchema.post(/^find/,function (docs,next){
      console.log(`query took ${Date.now()-this.start} milliseconds!`)
      console.log(docs)
      next();
   })
   //aggregation middleware
   tourSchema.pre('aggregate',function (next){
      this.pipeline().unshift({$match:{secretTour:{$ne: true}}})
     console.log(this.pipeline())
     next();
   })
   const Tour  = mongoose.model('Tour', tourSchema);
   module.exports = Tour;