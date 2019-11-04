const port = process.env.PORT || 8080;
const saltRounds = process.env.SALT_ROUNDS || 12;
const secretKey = process.env.SECRET_KEY || "TEST_KEY";

module.exports= { port,saltRounds,secretKey };