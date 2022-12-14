
import axios from 'axios'
import {showAlert} from './alert'
export const login =async (email, password)=>{
  console.log(email, password)
   try{
    const res = await axios({
        method:'POST',
        url:'http://127.0.0.1:3000/api/v1/users/login',
        data:{
            email,
            password
        }
    })
    if(res.data.status ==='success'){
      showAlert('success','login ok')
      window.setTimeout(()=>{
        location.assign('/')
      },1500)
    }
    console.log(res)
   } catch (err) {
    showAlert('err',err.response.data.message);
   }
}
