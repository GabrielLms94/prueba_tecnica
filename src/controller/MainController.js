const connection = require('../database')

const authRegister = async () => {

}

const authLogin = async () => {

}

const getBooks =async () => {
    let response;
    await connection.query('SELECT * from books',(err, rows, fields) => {
        if (!err){
            response = rows;
        }else {
            response = err;
        }
    });
    return response;
}

const postBooks = async () => {

}

const deleteBooks = async () => {

}

module.exports = {
    authRegister,
    authLogin,
    getBooks,
    postBooks,
    deleteBooks
}

