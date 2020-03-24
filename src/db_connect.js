const mysql = require("mysql");

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

module.exports = db;
