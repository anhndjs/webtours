const  Tour = require('../models/tourModels');
const catchAsync = require('./../utils/catchAsync')
exports.getOverview =catchAsync(async (req,res,next)=>{
    //1) get tour data from collection 
    const tours = await  Tour.find();
    res.status(200).render('overview',{ 
      title:'All tours',
      tours 
    });
});
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });
  res
    .status(200)
    
    .render('tour', {
      title: `${tour.title} Tour`,
      tour
    });
});
exports.getLoginForm = (req,res)=>{
  res.status(200).render('login',{
    title: 'log into your account'
  })
}