const fs = require('fs');
 const mongoose = require('mongoose');
 const dotenv = require('dotenv');
 const Tour = require('./../../models/tourModels');
 const Review = require('./../../models/reviewModel');
 const User = require('./../../models/userModel');
 dotenv.config({path:'./env'})
 function connect(){
    try {
       //conect
        mongoose.connect("mongodb+srv://test:123qweasd@sandbox.sl1r9.mongodb.net/natours",{
           useUnifiedTopology: true,
           useNewUrlParser: true,
      });
   console.log('connect to mongodb')
   } catch (error) {
        console.log('connect fail');
   }
   }
connect();
// read json file 
//  const tours =  JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`,'utf-8'));
//  // import data into db 
//   const importData = async ()=>{
//     try{
//       await Tour.create(tours);
//       console.log('data sussessfully loaded');
//     }catch(err){
//       console.log(err)
//     }
//   };
//   const deleteData = async ()=>{
//     try{
//         await Tour.deleteMany();
//         console.log('data sussessfully delete');
//         process.exit()
//       }catch(err){
//         console.log(err)
//       }
//   }
//   if(process.argv[2] ==='--import'){
//    importData();
//   }else if (process.argv[2] ==='--delete'){
//     deleteData();
//   }
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours.json`, 'utf-8')
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/users.json`, 'utf-8')
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);
// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users,{validateBeforeSave: false});
    await Review.create(reviews);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
