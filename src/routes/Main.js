const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const key = require('../keys');
require('../middleware/verifyToken')
const connection = require('../database');
const {verifyToken} = require("../middleware/verifyToken");


router.post('/auth/register', (req, res) => {
    let passwordEncrypted;
    const {email, name, password} = req.body

    if (email === '') {
        res.json({
            message: 'Todos los campos son requeridos'
        })
    }

    bcrypt.hash(password, key.rounds, (err, passwordEncrypted) => {
        if (!err) {

            connection.query('INSERT INTO `users`(`email`, `name`, `pass`) VALUES ( ?, ?, ?)', [email, name, passwordEncrypted], (err, rows, fields) => {
                if (!err) {
                    res.json({
                        message: true
                    });
                } else {
                    res.json({
                        message: false,
                        Error: err.sqlMessage
                    });
                }
            });

        } else {
            res.json({
                message: 'Error durante el Hasheo'
            })
        }
    });

});

router.post('/auth/login', (req, res) => {
    let {email, password} = req.body


    connection.query('SELECT id,email, pass from users where email = ? ', [email], (err, rows, fields) => {
        if (!err) {
            if (rows.length > 0) {

                bcrypt.compare(password, rows[0].pass, (err, coinciden) => {
                    if (err) {
                        res.json({
                            message: 'Error comparando: ', err
                        })
                    } else {
                        if (coinciden) {

                            let user_obj = {
                                id: rows[0].id,
                                email: rows[0].email
                            }

                            jwt.sign({user: user_obj}, key.jwt, {expiresIn: '24h' }, (err, token) => {
                                res.json({
                                    message: 'Te logueaste ',
                                    token: token
                                })
                            });


                        } else {
                            res.json({
                                message: 'Los datos de acceso no coinciden '
                            })
                        }
                    }
                });

            } else {
                res.json({
                    message: 'No hay registros'
                })
            }
        } else {
            res.json(err)
        }
    });


});

router.get('/books', (req, res) => {
    connection.query('select author, isbn, release_date, title, email, name FROM books b JOIN users u on b.users_id = u.id', (err, rows, fields) => {
        if (!err) {
            res.json(rows)
        } else {
            res.json(err)
        }
    });
});


router.post('/books', verifyToken, (req, res) => {

    jwt.verify(req.token, key.jwt, (err, data) => {
        if (!err) {

            const {isbn, title, author, release_date} = req.body
            connection.query('INSERT INTO `books`(`author`, `isbn`, `release_date`, `title`, `user_id`, `users_id`) ' +
                'VALUES (?, ?, ?, ?, ?, ?)', [author, isbn, release_date, title, data.user.id, data.user.id],
                (err, rows, fields) => {
                    if (!err) {
                        res.json({
                            message: 'titulo creado con el id: '+ rows.insertId
                        })
                    } else {
                        res.json(err)
                    }
                });


        } else {
            res.status(403).send('Error con la verificacion del token')
        }

    });

});


router.delete('/books/:id', verifyToken, (req, res) => {

    jwt.verify(req.token, key.jwt, (err, data) => {
        if (!err) {

            const {id} = req.params

            connection.query('DELETE FROM `books` WHERE id = ? ', [id],
                (err, rows, fields) => {
                console.log()
                    if (!err) {

                        if (rows.affectedRows > 0){
                            res.json({
                                message: 'titulo eliminado'
                            })
                        }else{
                            res.json({
                                message: 'El titulo no existe'
                            })
                        }


                    } else {
                        res.json(err)
                    }
                });


        } else {
            res.status(403).send('Error con la verificacion del token')
        }

    });

});


module.exports = router;