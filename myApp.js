let express = require('express');
let app = express();

require('dotenv').config();
const bodyParser = require('body-parser');

//console.log("Hello World");

// middleware for static file (i.e. HTML)
app.use('/public', express.static(__dirname + '/public'));

//Middleware for Request logger
app.use('/', (req, res, next) => {
    const ip = req.ip;
    const method = req.method;
    const path = req.path;
    const string = `${method} ${path} - ${ip}`;
    console.log(string);
    next();
});

// Parse Body (payload) data from request
app.use( bodyParser.urlencoded({ extended: false }) );


//-------------------------------------------------
// RESTful API mehods:


// HTML Sever: serve static files
app.get('/', (req, res) => {
    const string = "Hello Express";
    const absolutePath = __dirname + '/views/index.html';
    res.sendFile(absolutePath);
});

// Data Server: Serve Data (basic API get method)
app.get('/json', (req, res) => {
    const isUppercase = process.env.MESSAGE_STYLE;
    if(isUppercase==='uppercase'){
        res.json({ "message": "HELLO JSON"});
    }
    else{
        res.json({"message": "Hello json"});     
    }
});


// Time server (chaining handlers)
app.get('/now', (req, res, next) => {
    req.time = new Date().toString();
    next();
}, (req, res) => {
        res.json({ time: req.time });
});


//Echo Server
app.get('/:word/echo', (req, res) => {
    const echoWord = req.params.word;
    res.json({ echo: echoWord });
});


app.route('/name')
    .get((req, res) => {
        const firstName = req.query.first;
        const lastName = req.query.last;
        const fullName = `${firstName} ${lastName}`;

        res.json({ name: fullName });
    })
    .post((req, res) => {
        const firstName = req.body.first;
        const lastName = req.body.last;
        const fullName = `${firstName} ${lastName}`;

        res.json({ name: fullName });
    });

 module.exports = app;
