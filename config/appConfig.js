const port = process.env.PORT || 8080;
const saltRounds = process.env.SALT_ROUNDS || 12;
const secretKey = process.env.SECRET_KEY || 'TEST_KEY';
const clientID = '22BC4H';
const clientSecret = process.env.CLIENT_SECRET;
const mailgunApiKey = process.env.MAILGUN_API_KEY || 'fakekey';

module.exports = {
    port,
    saltRounds,
    secretKey,
    clientID,
    clientSecret,
    mailgunApiKey,
};
