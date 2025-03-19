const sql=require('mysql2')

const connection=sql.createPool({
    host:'localhost',
    port:"3306",
    user:'root',
    password:'purnima',
    database:'iqfees'
}).promise()



// const connection = mysql.createConnection({
//     host: 'database-3.c7aaikuech7r.ap-south-1.rds.amazonaws.com',
//     port: 3306,
//     user: 'admin',
//     password: 'Abhaykalp',
//     database: 'studentfees'
// }).promise()




module.exports=connection
