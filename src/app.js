const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.status(200);
    res.send("Welcome to the root of the server");
});

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

app.listen(PORT, (error) => {
    if (!error) {
        console.log("Server is running on port: " + PORT);
    } else {
        console.log("Error, server can't start: " + error);
    }
});
