import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { baseUrl} from '../util/util'
import Spinner from '../components/Spinner';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const navigate = useNavigate();
  const [load, setload] = useState(false);

  const getCurrentDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); 
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };


const [editId, setEditId] = useState('');  

const handleEdit = (student) => {
    setFormData({
      name: student.name,
      class: student.class,
      fees: student.fees,
      dateOfJoin: new Date(student.doj).toISOString().split('T')[0],  
      subjects: student.subject.split(','),  
    });
    setEditId(student.id);  
  };
  

  const [formData, setFormData] = useState({
    name: '',
    class: '',
    fees: '',
    dateOfJoin: getCurrentDate(),
    subjects: [],
  });

  const [data, setData] = useState([]); 

  const subjectsList = [
    'PHY', 'CHE', 'BIO', 'COM', 'ACC', 'COS', 'MAT', 'ECO', 'ENG',
  ];

 
  const fetchStudent = async () => {
    const token = JSON.parse(localStorage.getItem('token'));
    if (!token) {
      toast.error('Please Login!');
      return navigate('/');
    }
    setload(true);
    const response = await fetch(`${baseUrl}/api/iqfees/getAllStudents`, {
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


  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token'));
    if (!token) {
      navigate('/');
      toast.error('Please Login !!');
    } 
    else 
    {
        fetchStudent();
    }
  }, []);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (subject) => {
    const updatedSubjects = formData.subjects.includes(subject)
      ? formData.subjects.filter((sub) => sub !== subject) 
      : [...formData.subjects, subject]; 

    setFormData({
      ...formData,
      subjects: updatedSubjects,
    });
  };

  const handleSubmit = async () => {
   
      const studata = {
        name: formData.name,
        cl: formData.class,
        fees: formData.fees,
        doj: formData.dateOfJoin,
        subject: formData.subjects.join(','), 
      };
      
  
      const token = JSON.parse(localStorage.getItem('token'));
  
      setload(true);
  
      if (editId!=='') 
        {
        const response = await fetch(`${baseUrl}/api/iqfees/updStudent/${editId}`, {
          method: 'PUT',  
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(studata),
        });
        const data = await response.json();

        setload(false);
        

        if (!response.ok) 
            {
            return toast.error(data.msg);
             
          } 
          
         
        toast.success(data.msg);
        fetchStudent();  
        handleReset();  
      
      } 
      else 
      {
       const response = await fetch(`${baseUrl}/api/iqfees/addStudent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(studata),
        });
        const data = await response.json();

        setload(false);

        if (!response.ok) 
            {
            return toast.error(data.msg);
             
          } 
         
          
         
        toast.success(data.msg);
        fetchStudent();  
        handleReset();  
      }
  
  
    
    
  };
  

  const handleDelist = async (id) => {
    const token = JSON.parse(localStorage.getItem('token'));
    if (!token) {
      toast.error('Please Login!');
      return navigate('/');
    }
    if(window.confirm('Are you sure you want to Delist the Student ?'))
        {
            setload(true);
    const response = await fetch(`${baseUrl}/api/iqfees/setIsDelist/${id}`, {
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
fetchStudent()        }  
};

  const handleReset = () => {
    setFormData({
      name: '',
      class: '',
      fees: '',
      dateOfJoin: getCurrentDate(),
      subjects: [],
    });
    setEditId(''); 
  };

  return (
    <>
    <Spinner  isloading={load}/>
    <Navbar />
      <div className='dashboard-container'>

        <div className='left-section'>
            <div style={{textAlign:"center"}}>
            <span style={{fontSize:"17px",fontWeight:"600"}}><u>Add Student</u></span>

            </div>
          <div className='stuname'>
            <label className='labels'>Enter Name:</label><br/>
            <input
            placeholder='Enter Name'
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className='stuclass'>
            <label className='labels'>Enter Class:</label><br/>
            <select className='classelect'
              name='class'
              value={formData.class}
              onChange={handleChange}
            >
              <option value=''>--Select Class--</option>
              {[6, 7, 8, 9, 10, 11, 12].map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          <div className='stufees'>
            <label className='labels'>Enter Fees:</label><br/>
            <input
            placeholder='Enter Fees'
              type='number'
              name='fees'
              value={formData.fees}
              onChange={handleChange}
            />
          </div>

          

          <div className='studoj'>
            <label className='labels'>Enter Date of Joining:</label><br/>
            <input
              type='date'
              name='dateOfJoin'
              value={formData.dateOfJoin}
              onChange={handleChange}
            />
          </div>

          <div className='stusub'>
  <label className='labels'>Choose Subjects:</label>
  <div className='checkbox-grid'>
    {subjectsList.map((subject) => (
      <div key={subject}>
        <input
          type='checkbox'
          checked={formData.subjects.includes(subject)}
          onChange={() => handleCheckboxChange(subject)}
        />
        <label>{subject}</label>
      </div>
    ))}
  </div>
</div>


<div className='buttongrp'>
  <button className='resetbtn' onClick={handleReset}>Reset</button>
  <button className='addbtn' onClick={handleSubmit}>
    {editId==='' ? 'Add' : 'Update'}
  </button>
</div>


        </div>

        <div className='right-section'>
        <div style={{textAlign:"center"}}>
            <span style={{fontSize:"17px",fontWeight:"600"}}><u>Display</u></span>

            </div>          
           <div className='tblcontainer'>
           <table>
          {data.length===0?
      <thead><tr><th className=''>Add Students !!!</th></tr></thead>:
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
        Fees Cycle
        </th>
        <th scope="col" className="">
        Fees
        </th>
        <th scope="col" className="">
        Date Of Join
        </th>
        <th scope="col" className="">
       Subjects
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
                      <td className=''>{datas.feesCycle}</td>
                      <td className=''>{datas.fees}</td>
                      <td className=''>{new Date(datas.doj).toISOString().split('T')[0]}</td>
                      <td className=''>{datas.subject}</td>

                      <td className="" >
          <button className='editbut' onClick={() => handleEdit(datas)}>Edit</button>
          <button className='delbut' onClick={()=>handleDelist(datas.id)}>Delist</button>
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

export default Dashboard;
