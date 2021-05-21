const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 3003;
const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ezfit';
const saltRounds = process.env.SALT_ROUNDS || 12;
const secretKey = process.env.SECRET_KEY || 'TEST_KEY';
const clientID = process.env.FITBIT_CLIENT_ID || '22BC4H';
const clientSecret =
    process.env.FITBIT_CLIENT_SECRET || 'ENTER_CLIENT_KEY_HERE';
const mailDomain = 'mail.ezfit.rocks';
const mailgunApiKey = process.env.MAILGUN_API_KEY || 'ENTER_MAILGUN_KEY_HERE';

module.exports = {
    port,
    mongodbUri,
    saltRounds,
    secretKey,
    clientID,
    clientSecret,
    mailDomain,
    mailgunApiKey,
};
