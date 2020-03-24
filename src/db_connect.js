const mysql = require("mysql");
const bluebird = require("bluebird");

const db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "test"
});
db.on("error", ex => {
	console.log(ex);
});
db.connect();

bluebird.promisifyAll(db);

module.exports = db;
