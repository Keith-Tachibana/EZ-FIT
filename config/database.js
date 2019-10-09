//Set up mongoose connection
const mongoose = require('mongoose');
const mongoDB = 'mongodb://localhost:27017/ezphr'
mongoose.connect(mongoDB, {useNewUrlParser: true, useCreateIndex: true});

module.exports = mongoose;