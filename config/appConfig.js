const port = process.env.PORT || 8080;
const saltRounds = process.env.SALT_ROUNDS || 12;
const secretKey =
	process.env.SECRET_KEY || 'TEST_KEY';
const clientID = '22BC4H';
const clientSecret =
	'705322f417660fbfd1ffe1bc86ef80e5';
const mailgunApiKey = process.env.MAILGUN_API_KEY;

module.exports = {
	port,
	saltRounds,
	secretKey,
	clientID,
	clientSecret,
	mailgunApiKey,
};
