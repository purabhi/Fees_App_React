import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { baseUrl} from '../util/util'
import Spinner from '../components/Spinner';
import Navbar from '../components/Navbar';

const Enlist = () => {
  const navigate = useNavigate();
  const [load, setload] = useState(false);

 
  const [data, setData] = useState([]); 

  const fetchDelistedStudent = async () => {
    const token = JSON.parse(localStorage.getItem('token'));
    if (!token) {
      toast.error('Please Login!');
      return navigate('/');
    }
    setload(true);
    const response = await fetch(`${baseUrl}/api/iqfees/getAllDelistedStudents`, {
      method: "GET",
      headers: { "Content-Type": "application/json", 
        'Authorization': `Bearer ${token}`,
    },
    });

    const data = await response.json();
    setload(false);
    if (!response.ok) 
        return toast.error(data.msg);
    
    setData(data.msg);
  };


  const handleEnlist = async (id) => {
    const token = JSON.parse(localStorage.getItem('token'));
    if (!token) {
      toast.error('Please Login!');
      return navigate('/');
    }
    if(window.confirm('Are you sure you want to Enlist the Student ?'))
      {
        setload(true);
    const response = await fetch(`${baseUrl}/api/iqfees/setIsEnlist/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", 
        'Authorization': `Bearer ${token}`,
    },
    });

    const data = await response.json();
    setload(false);
    if (!response.ok) 
        return toast.error(data.msg);
    toast.success(data.msg)
fetchDelistedStudent()
      }  
};


const handleDelete=async(id)=>{
  const token = JSON.parse(localStorage.getItem('token'));
    if (!token) {
      toast.error('Please Login!');
      return navigate('/');
    }
    if(window.confirm('Are you sure you want to Permanently Delete the Student ?'))
      {
        setload(true);
    const response = await fetch(`${baseUrl}/api/iqfees/deleteStudent/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", 
        'Authorization': `Bearer ${token}`,
    },
    });

    const data = await response.json();
    setload(false);
    if (!response.ok) 
        return toast.error(data.msg);
    toast.success(data.msg)
fetchDelistedStudent()
      }  
}


  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token'));
    if (!token) {
      navigate('/');
      toast.error('Please Login !!');
    } 
    else 
    {
        fetchDelistedStudent();
    }
  }, []);



  return (
    <>
    <Spinner  isloading={load}/>
    <Navbar />
      <div className=''>
        <div className=''>
        <div style={{textAlign:"center"}}>
            <span style={{fontSize:"17px",fontWeight:"600"}}><u>Display</u></span>

            </div>          
           <div className='tblcontainer'>
           <table className='enlisttable'>
          {data.length===0?
      <thead><tr><th className='' style={{textAlign:"center"}}>No Students !!!</th></tr></thead>:
  <>
    <thead className="">
      <tr>
      <th scope="col" className="">
        Name
        </th>

        <th scope="col" className="">
       Class
        </th>

       
        <th scope="col" className="">
        Action
        </th>
        
        
       
      </tr>
    </thead>
    <tbody className=''>
    {data.map((datas)=>{
      return(
        <tr key={datas.id} className=''>
                      <td className=''>{datas.name}</td>
                      <td className=''>{datas.class}</td>
                      

                      <td className="" >
          <button className='editbut' onClick={() => handleEnlist(datas.id)}>Enlist</button>
          <button className='delbut'onClick={()=>handleDelete(datas.id)}>Delete</button>
       </td>

                    </tr>      )
    })}
     
    </tbody>
    
    </>
}
          </table>
           </div>
        </div>
      </div>
    </>
  );
};

export default Enlist;
