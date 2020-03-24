const express = require("express");
const db = require(__dirname + "/../src/db_connect.js");
const router = express.Router();

router.get("/:page?", (req, res) => {
	const t_sql = "SELECT COUNT(1) num FROM  address_book";
	db.query(t_sql, (error, result) => {
		output.totalRows = Result[0].num;
		res.json(output);
	});
});
