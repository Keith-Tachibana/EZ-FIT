//Set up mongoose connection
const mongoose = require('mongoose');
const mongoDB = 'mongodb://heroku_vc9ppq5b:o34ra1rle59heerll10fbco66d@ds141228.mlab.com:41228/heroku_vc9ppq5b'
mongoose.connect(mongoDB, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});

module.exports = mongoose;