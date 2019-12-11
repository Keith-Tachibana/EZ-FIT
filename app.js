const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const path = require('path');
const jwt = require('jsonwebtoken');
const home = require('./routes/home');
const api = require('./routes/api');
const mongoose = require('./config/database'); //database configuration
const appConfig = require('./config/appConfig');
const enforce = require('express-sslify');
const nakedRedirect = require('express-naked-redirect');
const SECRET_KEY = appConfig.secretKey;
const port = appConfig.port;
const app = express();
app.set('secretKey', SECRET_KEY);

app.use(favicon(path.join(__dirname, 'client/public', '/favicon.ico')));
//Add file name as last arg to change initial file to be loaded

//Connect to mongodb
mongoose.connection.on(
    'error',
    console.error.bind(console, 'MongoDB connection error:')
);
app.use(logger('dev'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'production') {
    app.use(nakedRedirect());
    app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

//Static files
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(express.static('client/public'));

//Api private route
app.use('/api', validateUser, api);
app.use('/fitbit', api);
//Public route
app.use('/', home);

app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/client/build', 'index.html'))
);

//handle 404 error
app.use((req, res, next) => {
    let err = new Error('Not found');
    err.status = 404;
    next(err);
});

function validateUser(req, res, next) {
    jwt.verify(
        req.headers['x-access-token'],
        req.app.get('secretKey'),
        (err, decoded) => {
            if (err) {
                res.json({
                    status: 'error',
                    message: err.message,
                    data: null,
                });
            } else {
                //add user id to request
                req.body.userId = decoded.id;
                next();
            }
        }
    );
}

//handle errors
app.use((err, req, res, next) => {
    console.log(err);

    if (err.status === 404) {
        res.status(404).json({ message: 'Not found' });
    } else if (err.name === 'MongoError' && err.code === 11000) {
        //pass
    } else {
        res.status(500).json({ message: 'Something broke!' });
    }
});

app.listen(port, () => {
    console.log('Node server listening on port ' + port);
});

module.exports = { validateUser };
