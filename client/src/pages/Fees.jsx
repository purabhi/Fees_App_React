import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';
import Navbar from '../components/Navbar';
import { baseUrl } from '../util/util';

const Fees = () => {
  const navigate = useNavigate();
  const [load, setload] = useState(false);
  const [month, setMonth] = useState('');
  const [data, setData] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token'));
    if (!token) {
      navigate('/');
      toast.error('Please Login !!');
    }
  }, []);

  const handleChange = async (e) => {
    const selectedMonth = e.target.value;
    setMonth(selectedMonth);

    if (selectedMonth) {
      const token = JSON.parse(localStorage.getItem('token'));
      if (!token) {
        toast.error('Please Login !!');
        return navigate('/');
      }
      setload(true);

      const response = await fetch(`${baseUrl}/api/iqfees/getStudentFeesByMonth/${selectedMonth}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setload(false);
      if (!response.ok) {
        setData([]);
        return toast.error(data.msg);
      }
      setData(data.msg || []);
    } else {
      setData([]);
    }
  };

  const handleCheckboxChange = (studentId) => {
    setSelectedStudents((prevSelected) => {
      if (prevSelected.includes(studentId)) {
        return prevSelected.filter((id) => id !== studentId);
      } else {
        return [...prevSelected, studentId];
      }
    });
  };

  const handleUpdatePaymentStatus = async () => {
    if (selectedStudents.length === 0) {
      return toast.error('No students selected for update');
    }
  
    const selectedStudentData = data.filter(student => selectedStudents.includes(student.id));
    const confirmationMessage = `Month: ${month}\n\n` + 
      selectedStudentData.map(student => 
        `Name: ${student.name}, Fees: ${student.fees}`
      ).join('\n');
  
    const confirmed = window.confirm(
      `Are you sure you want to update the Payment Status 
      for the following students for the month of ${month}?\n\n${confirmationMessage}`
    );
  
    if (confirmed) {
      setload(true);
      const token = JSON.parse(localStorage.getItem('token'));
  
      const response = await fetch(`${baseUrl}/api/iqfees/updateStudentsFees`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ studentIds: selectedStudents, month }),
      });
  
      const data = await response.json();
      setload(false);
  
      if (response.ok) {
        setData((prevData) =>
          prevData.map((student) =>
            selectedStudents.includes(student.id)
              ? { ...student, paystatus: 'Paid' }
              : student
          )
        );
  
        toast.success(data.msg);
        setSelectedStudents([]);
      } else {
        toast.error(data.msg);
      }
    }
  };
  



  return (
    <>
      <Spinner isloading={load} />
      <Navbar />
      <div className="dashboard-container">
        <div className="left-section">
          <div className="stuclass">
            <label className="labels">Enter Class:</label>
            <br />
            <select
              className="classelect"
              name="month"
              value={month}
              onChange={handleChange}
            >
              <option value="">--Select Month--</option>
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 
              'Aug', 'Sept', 'Oct', 'Nov', 'Dec'].map((mon) => (
                <option key={mon} value={mon}>
                  {mon}
                </option>
              ))}
            </select>
          </div>

          <div className="buttongrpfees">
            <button className="addbtn" onClick={handleUpdatePaymentStatus}>
              Update
            </button>
          </div>
        </div>

        <div className="right-section">
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '17px', fontWeight: '600' }}>
              <u>Display</u>
            </span>
          </div>
          <div className="tblcontainer">
            <table>
              {data.length === 0 ? (
                <thead>
                  <tr>
                    <th className="" style={{ textAlign: 'center' }}>
                      No Students !!!
                    </th>
                  </tr>
                </thead>
              ) : (
                <>
                  <thead className="">
                    <tr>
                      <th style={{ textAlign: 'center' }}>Select</th>
                      <th style={{ textAlign: 'center' }}>Name</th>
                      <th style={{ textAlign: 'center' }}>Class</th>
                      <th style={{ textAlign: 'center' }}>Fees Cycle</th>
                      <th style={{ textAlign: 'center' }}>Fees</th>
                      <th style={{ textAlign: 'center' }}>Payment Status</th>
                    </tr>
                  </thead>
                  <tbody>
                  {data.map((student) => (
    <tr
        key={student.id}
        style={{
            backgroundColor: student.paystatus === null ? '#ff00004d' : '#0080008f',
        }}
    >
        <td>
            <input
                type="checkbox"
                value={student.id}
                checked={selectedStudents.includes(student.id) || student.paystatus !== null}
                onChange={() => handleCheckboxChange(student.id)}
                disabled={student.paystatus !== null} 
            />
        </td>
        <td style={{ textAlign: 'center' }}>{student.name}</td>
        <td style={{ textAlign: 'center' }}>{student.class}</td>
        <td style={{ textAlign: 'center' }}>{student.feesCycle}</td>
        <td style={{ textAlign: 'center' }}>{student.fees}</td>
        <td style={{ textAlign: 'center' }}>
            {student.paystatus === null ? 'Not Paid' : 'Paid'}
        </td>
    </tr>
))}

                  </tbody>
                </>
              )}
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Fees;
