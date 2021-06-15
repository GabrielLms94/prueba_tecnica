const jwt = require("jsonwebtoken");

// Authorization: Bearer

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (typeof  bearerHeader !== 'undefined'){
        const token = bearerHeader.split(" ")[1];
        req.token = token;
        next();
    }else {
        res.status(403).send('Error con la verificacion del token')
    }
}

module.exports ={
    verifyToken
}
