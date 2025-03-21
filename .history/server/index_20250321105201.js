const express = require("express");
// const cors = require("cors");
const jwt = require('jsonwebtoken');
const path=require('path')

const app = express();
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connection = require("./connection");

// login
app.post("/api/iqfees/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(401).json({ msg: "Invalid username or password" });
    }

    const results = await connection.query('SELECT * FROM user WHERE username=? AND password=?', [username, password]);

       
        if (results[0].length === 0)
            return res.status(401).json({ msg: 'Invalid username or password' });

    const token = jwt.sign({}, "hello", { expiresIn: "1h" });

    return res.status(201).json({ msg: "Successfully Logged In", token });
  } 
  catch (err) 
  {
    console.log(err);
    return res.status(500).json({ msg: "Server Error" });
  }

});


// get all students that are not delisted
app.get("/api/iqfees/getAllStudents", async (req, res) => {
  try {
    const Result = await connection.query(
      "SELECT * from student where isDelist='no' "
    );

    if (Result.length === 0) {
      return res.status(401).json({ msg: "Students Not Fetched!" });
    }

    return res.status(201).json({ msg: Result[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server Error" });
  }
});


// get all students that are  delisted
app.get("/api/iqfees/getAllDelistedStudents", async (req, res) => {
    try {
      const Result = await connection.query(
        "SELECT * from student where isDelist='yes' "
      );
  
      if (Result.length === 0) {
        return res.status(401).json({ msg: "Students Not Fetched!" });
      }
  
      return res.status(201).json({ msg: Result[0] });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Server Error" });
    }
  });
  


// adding student
app.post('/api/iqfees/addStudent', async (req, res) => {
  try {
      const { name, cl, doj, subject, fees } = req.body;

      if (!name || !cl || !doj || subject.length === 0 || !fees) {
          return res.status(401).json({ msg: "Enter Details Properly" });
      }

      const dojDate = new Date(doj);
      const dayOfMonth = dojDate.getDate();
      let feesCycle = '';

      if (dayOfMonth >= 1 && dayOfMonth <= 10) {
          feesCycle = '1-10';
      } else if (dayOfMonth >= 11 && dayOfMonth <= 20) {
          feesCycle = '10-20';
      } else if (dayOfMonth >= 21 && dayOfMonth <= 31) {
          feesCycle = '20-30';
      }

      const id = name + '-' + Date.now();

      const insertResult = await connection.query('INSERT INTO student (id, name, subject, class, feesCycle, doj, fees, isDelist) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
          [id, name, subject, cl, feesCycle, doj, fees, "no"]);

      if (insertResult[0].affectedRows !== 1) {
          return res.status(401).json({ msg: "Student Is Not Added" });
      }

      const startDate = new Date(doj);  
      const currentYear = startDate.getFullYear();  
      const startMonth = startDate.getMonth();  
      const monthsToInsert = [];

      if (startMonth >= 3 && startMonth <= 11) {
          for (let month = startMonth; month < 12; month++) {
              monthsToInsert.push(new Date(currentYear, month, 1));
          }

          for (let month = 0; month < 3; month++) {
              monthsToInsert.push(new Date(currentYear + 1, month, 1));
          }
      } 
      else if (startMonth >= 0 && startMonth < 3) {
          for (let month = startMonth; month < 3; month++) {
              monthsToInsert.push(new Date(currentYear, month, 1));
          }
      }

      const stuid = id;
      for (const monthDate of monthsToInsert) 
      {
          const monthShortName = monthDate.toLocaleString('default', { month: 'short' });
          const year = monthDate.getFullYear();
          await connection.query('INSERT INTO studentvsfees (month, year, paystatus, paydate, amount, stuid) VALUES (?, ?, ?, ?, ?, ?)', 
              [monthShortName, year, null, null, fees, stuid]);
      }

      res.status(201).json({ msg: "Student Added Successfully" });
  } catch (error) {
      console.error(error);
      return res.status(501).send({ msg: 'Server error' });
  }
});





// setting student to delist
app.put("/api/iqfees/setIsDelist/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) 
  {
    return res.status(400).json({ msg: "Plss fill all fileds !!" });
  }

  try 
  {
    const result = await connection.query(
      "UPDATE student SET isDelist=? WHERE id=?",
      ["yes", id]
    );

    if (result[0].affectedRows === 0) 
    {
      return res
        .status(404)
        .json({ msg: "Student not found or no changes made." });
    }

    return res.status(200).json({ msg: "Student Delisted successfully." });
  } 
  catch (error) 
  {
    console.error(error);
    return res.status(500).json({ msg: "Server Error" });
  }
});



// setting student to enlist
app.put("/api/iqfees/setIsEnlist/:id", async (req, res) => {
    const { id } = req.params;
  
    if (!id) 
    {
      return res.status(400).json({ msg: "Plss fill all fileds !!" });
    }
  
    try 
    {
      const result = await connection.query(
        "UPDATE student SET isDelist=? WHERE id=?",
        ["no", id]
      );
  
      if (result[0].affectedRows === 0) 
      {
        return res
          .status(404)
          .json({ msg: "Student not found or no changes made." });
      }
  
      return res.status(200).json({ msg: "Student Enlisted successfully." });
    } 
    catch (error) 
    {
      console.error(error);
      return res.status(500).json({ msg: "Server Error" });
    }
  });


  app.delete("/api/iqfees/deleteStudent/:id", async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ msg: "Please provide a valid student ID." });
    }

    try {

        const deleteFeesResult = await connection.query(
            "DELETE FROM studentvsfees WHERE stuid = ?",
            [id]
        );

        const deleteStudentResult = await connection.query(
            "DELETE FROM student WHERE id = ?",
            [id]
        );

        if (deleteStudentResult[0].affectedRows === 0||deleteFeesResult[0].affectedRows===0) {
            return res.status(404).json({ msg: "Student not found or no changes made." });
        }

        return res.status(200).json({ msg: "Student record deleted successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server Error" });
    }
});



// updating students
app.put('/api/iqfees/updStudent/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const { name, cl, subject, doj, fees } = req.body;

      if (!name || !cl || subject.length == 0 || !doj || !fees || !id) {
          return res.status(401).json({ msg: "Enter Details Properly" });
      }

      const dojDate = new Date(doj);
      const dayOfMonth = dojDate.getDate();
      let feesCycle = '';

      if (dayOfMonth >= 1 && dayOfMonth <= 10) {
          feesCycle = '1-10';
      } else if (dayOfMonth >= 11 && dayOfMonth <= 20) {
          feesCycle = '10-20';
      } else if (dayOfMonth >= 21 && dayOfMonth <= 31) {
          feesCycle = '20-30';
      }

      const updateResult = await connection.query(
          'UPDATE student SET name=?, class=?, subject=?, feesCycle=?, doj=?, fees=? WHERE id=?',
          [name, cl, subject, feesCycle, doj, fees, id]
      );

      if (updateResult[0].affectedRows !== 1) {
          return res.status(401).json({ msg: "Student Not Updated" });
      }

      res.status(201).json({ msg: "Student Updated Successfully" });
  } catch (error) {
      console.error(error);
      return res.status(501).send({ msg: 'Server error' });
  }
});



// fetching students for specific month
app.get("/api/iqfees/getStudentFeesByMonth/:month", async (req, res) => {
        const { month } = req.params; 
      
        if (!month) {
          return res.status(400).json({ msg: "Month is required" });
        }
      
        try {
          const query = `
            SELECT 
              student.id, 
              student.name, 
              student.class, 
              student.feesCycle, 
              student.fees, 
              studentvsfees.paystatus 
            FROM 
              student
            JOIN 
              studentvsfees 
            ON 
              student.id = studentvsfees.stuid 
            WHERE 
              studentvsfees.month = ? 
            AND 
              student.isDelist = 'no'; 
          `;
      
          const [result] = await connection.query(query, [month]);
      
          if (result.length === 0) {
            return res.status(404).json({ msg: "No students found for the selected month!" });
          }
      
          return res.status(200).json({ msg: result});
        } catch (error) {
          console.error(error);
          return res.status(500).json({ msg: "Server Error" });
        }
      });
      

// to update multiple student fees
app.put('/api/iqfees/updateStudentsFees', async (req, res) => {
try {
const { studentIds,month } = req.body;  
const paystatus = 'Paid';  
const paydate = new Date(); 

if (!studentIds || studentIds.length === 0 || !month)
{
    return res.status(400).json({ msg: "No students selected" });
}

const query = `
    UPDATE studentvsfees
    SET paystatus = ?, paydate = ?
    WHERE stuid IN (?) and month =?
`;
const updateResult = await connection.query(query, [paystatus, paydate, studentIds,month]);

if (updateResult[0].affectedRows === 0) {
    return res.status(401).json({ msg: "No records updated" });
}

res.status(200).json({ msg: "Payment statuses updated successfully" });
} catch (error) {
console.error(error);
return res.status(500).send({ msg: 'Server error' });
}
});

      


app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('*', (req, res) =>
res.sendFile(
    path.resolve(__dirname, '../', 'client', 'dist', 'index.html')
)
);



const port = 3000;
app.listen(port, () => console.log("server is running in port:", port));


module.exports = app;

