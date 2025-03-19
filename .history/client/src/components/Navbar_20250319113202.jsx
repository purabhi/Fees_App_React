import React from 'react';
import {  useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import '../App.css'

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    if (confirm("Are You Sure!")) {
      const token = JSON.parse(localStorage.getItem('token'));
      if (token) {
        localStorage.removeItem('token');
        navigate('/');
        toast.success('Successfully Log Out!');
      }
    }
  };
  return (
   <>
    <nav className="navbar">
      <div className="logo">
       
      </div>
      <ul className="nav-links">
        <li className="nav-item">
          <a href="/dashboard">Dashboard</a>
        </li>
        <li className="nav-item">
          <a href="/fees">Fees</a>
        </li>
        <li className="nav-item">
          <a href="/enlist">Enlist</a>
        </li>
        <li className="nav-item">
          <a className='logout' onClick={handleLogout}>Logout</a>
        </li>
      </ul>
    </nav>
   </>
  );
};

export default Navbar;
