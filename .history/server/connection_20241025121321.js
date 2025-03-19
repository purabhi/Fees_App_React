const sql=require('mysql2')

const connection=sql.createPool({
    host:'localhost',
    port:"3306",
    user:'root',
    password:'purnima',
    database:'iqfees'
}).promise()




module.exports=connection
