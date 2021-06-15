const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'examen'
});

connection.connect( function (err) {
    if (err){
        console.log(err)
        return;
    }else {
        console.log('SQL connected')
    }
});

module.exports = connection;