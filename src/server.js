const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use('/', require('./routes/Main'))

//Starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port: ',app.get('port'))
});