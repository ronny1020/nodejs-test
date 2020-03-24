const express = require("express");
const db = require(__dirname + "/../src/db_connect.js");
const router = express.Router();

router.get("/:page?", (req, res) => {
	const perPage = 3;
	let page = req.params.page || 1;
	const output = {
		totalRows: 0,
		perPage: perPage,
		totalPages: 0,
		page: 0,
		rows: 0
	};

	// const t_sql = "SELECT COUNT(1) num FROM address_book";
	// db.query(t_sql, (error, results) => {
	// 	output.totalRows = results[0].num;
	// 	output.totalPages = Math.ceil(output.totalRows / perPage);
	// 	if (output.page < 1) {
	// 		output.page = 1;
	// 	} else if (output.page > output.totalPages) {
	// 		output.page = output.totalPages;
	// 	}

	// 	const sql = `SELECT * address_book LIMIT ${(output.page-1)*output.perPage}, ${output.perPage}`;

	//     db.query(sql,(error, results) => {
	//         output.rows=results;
	//         res.json(output);
	//     });
	//     // res.json(output);

	// });
	const t_sql = "SELECT COUNT(1) num FROM address_book";
	db.queryAsync(t_sql)
		.then(results => {
			output.totalRows = results[0].num;
			output.totalPages = Math.ceil(output.totalRows / perPage);
			if (output.page < 1) {
				output.page = 1;
			} else if (output.page > output.totalPages) {
				output.page = output.totalPages;
			}

			const sql = `SELECT * FROM address_book LIMIT ${(output.page - 1) * output.perPage}, ${output.perPage}`;
			return db.queryAsync(sql);
		})
		.then(results => {
			output.rows = results;
			res.json(output);
		})
		.catch(ex => {});

});

module.exports = router;
