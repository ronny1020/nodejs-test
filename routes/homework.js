const express = require("express");

const db = require(__dirname + "/../src/db_connect.js");
const router = express.Router();

router.get("/:page?", (req, res) => {
	const perPage = 3;
	const output = {
		totalRows: 0,
		perPage: perPage,
		totalPages: 0,
		rows: 0
    };
    output.page=parseInt(req.params.page) || 1;

	const t_sql = "SELECT COUNT(1) num FROM products";
	db.queryAsync(t_sql)
		.then(results => {
			output.totalRows = results[0].num;
            output.totalPages = Math.ceil(output.totalRows / perPage);               
			if (output.page < 1) output.page = 1;
			if (output.page > output.totalPages) output.page = output.totalPages;
			const sql = `SELECT * FROM products ORDER BY sid DESC LIMIT ${(output.page - 1) * output.perPage}, ${output.perPage}`;
			return db.queryAsync(sql);
		})
		.then(results => {
			output.rows = results;
			res.json(output);
		})
		.catch(ex => {});
});

module.exports = router;
