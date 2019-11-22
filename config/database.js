//Set up mongoose connection
const appConfig = require('../config/appConfig');
const mongoose = require('mongoose');
const mongoDB = appConfig.mongodbUri;
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

module.exports = mongoose;
