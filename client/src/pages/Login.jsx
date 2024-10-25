import React, { useEffect, useState } from 'react'
import {  useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import { baseUrl} from '../util/util'
import Spinner from '../components/Spinner';


const Login = () => {
    const [load, setload] = useState(false);

    useEffect(()=>{
        const token = JSON.parse(localStorage.getItem('token'));

        if(token){
            localStorage.removeItem('token');
        }
    },[])
    const navigate = useNavigate();

  

    const [stu,setstu]=useState({
        username:'',
        password:''
    })

    const handleedit=(e)=>{
        setstu({...stu,[e.target.name]:e.target.value})
    }

    const logincall= async(e)=>{
      
        if(!stu.username || !stu.password)
        {
            toast.error('Plz Fill All Fields Properly') 
            return;
        }
        setload(true)
        const response = await fetch(`${baseUrl}/api/iqfees/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",   
            },
            body:JSON.stringify(stu)
          });
          setload(false)

          const data= await response.json()
          if (response.ok) {
            if (data.token) 
            {
              localStorage.setItem('token', JSON.stringify(data.token));
            }
            toast.success(data.msg)
          
            navigate('/dashboard');
            
          } 
          else 
          {
            toast.error(data.msg);
          }
          
         
         

    }

   
  return (
    <>
    <Spinner  isloading={load}/>
    <div className="login-container">
        <img style={{width:"48%",margin:"auto"}} src='NEWLOGO1.png'/>
      <h3>Login</h3>
      <div className="login-form">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={stu.username}
          onChange={handleedit}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={stu.password}
          onChange={handleedit}
        />
        <button onClick={logincall}>Login</button>
      </div>
      
    </div>
  
    </>
  )
}

export default Login