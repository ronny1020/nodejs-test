const express = require("express");

const db = require(__dirname + "/../src/db_connect.js");
const upload = require("../src/upload");
const router = express.Router();
const moment = require("moment-timezone");

router.use((req, res, next) => {
	res.locals.title = "Address Book";
	next();
});

router.get("/delete/:sid?", (req, res) => {
	const sql = "DELETE FROM `address_book` WHERE sid=?";
	db.queryAsync(sql, [req.params.sid])
		.then(results => {
			if (req.get("Referer")) {
				res.redirect(req.get("Referer"));
			} else {
				res.redirect("/address-book");
			}
		})
		.catch(ex => {
			console.log("ex:", ex);
			res.json({
				success: false,
				info: "Cannot delete"
			});
		});
});

router.get("/add", (req, res) => {
	res.render("address_book/add");
});

router.post("/add", upload.none(), (req, res) => {
	const output = {
		success: false,
		error: ""
	};

	if (req.body.name.length < 2) {
		output.error = "name is too short";
		return res.json(output);
	}

	const email_pattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	if (!email_pattern.test(req.body.email)) {
		output.error = "Email 格式錯誤";
		return res.json(output);
	}

	const sql = "INSERT INTO `address_book`(`name`, `email`, `mobile`, `birthday`, `address`, `created_at`) VALUES (?,?,?,?,?, NOW())";

	db.queryAsync(sql, [req.body.name, req.body.email, req.body.mobile, req.body.birthday, req.body.address])
		.then(results => {
			output.results = results;
			if (results.affectedRows === 1) {
				output.success = true;
			}
			res.json(output);
		})
		.catch(ex => {
			console.log("ex:", ex);
		});

	//res.json(req.body);
});

router.get("/edit/:sid", (req, res) => {
	const sql = "SELECT * FROM address_book WHERE sid=?";
	db.queryAsync(sql, [req.params.sid])
		.then(results => {
			if (results.length) {
				results[0].birthday = moment(results[0].birthday).format("YYYY-MM-DD");
				res.render("address_book/edit", results[0]);
			} else {
				res.redirect("/address_book");
			}
		})
		.catch(ex => {
			console.log("ex:", ex);
		});
});

router.post("/edit", upload.none(), (req, res) => {
	const output = {
		success: false,
		error: ""
	};

	if (req.body.name.length < 2) {
		output.error = "Name is too short!";
		return res.json(output);
	}

	const email_pattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	if (!email_pattern.test(req.body.email)) {
		output.error = "Format of Email is wrong!";
		return res.json(output);
	}

	const data = { ...req.body };
	delete data.sid;

	const sql = "UPDATE `address_book` SET ? WHERE sid=?";

	db.queryAsync(sql, [data, req.body.sid])
		.then(results => {
			output.results = results;
			if (results.changedRows === 1) {
				output.success = true;
			} else {
				output.error = "資料沒有變更";
			}
			res.json(output);
		})
		.catch(ex => {
			console.log("ex:", ex);
		});
});

const getDataByPage = (req, res) => {
	const perPage = 3;
	return new Promise((resolve, reject) => {
		if (!req.session.loginUser) {
			resolve({
				success: false,
				info: "請登入會員"
			});
			return;
		}
		let page = parseInt(req.params.page) || 1;
		const output = {
			totalRows: 0,
			perPage: perPage,
			totalPages: 0,
			page: page,
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
				const fm = "YYYY-MM-DD";
				for (let i of results) {
					i.birthday = moment(i.birthday).format(fm);
				}
				output.rows = results;
				res.render("address_book/list", output);
			})
			.catch(ex => {
				reject(ex);
			});
	});
};
router.get("/list/:page?", (req, res) => {
	const perPage = 3;
	let page = parseInt(req.params.page) || 1;
	const output = {
		totalRows: 0, // 總筆數
		perPage: perPage, // 每一頁最多幾筆
		totalPages: 0, //總頁數
		page: page, // 用戶要查看的頁數
		rows: 0 // 當頁的資料
	};

	const t_sql = "SELECT COUNT(1) num FROM address_book";
	db.queryAsync(t_sql)
		.then(results => {
			output.totalRows = results[0].num;
			output.totalPages = Math.ceil(output.totalRows / perPage);
			if (output.page < 1) output.page = 1;
			if (output.page > output.totalPages) output.page = output.totalPages;
			const sql = `SELECT * FROM address_book ORDER BY sid DESC LIMIT ${(output.page - 1) * output.perPage}, ${output.perPage}`;
			return db.queryAsync(sql);
		})
		.then(results => {
			const fm = "YYYY-MM-DD";
			for (let i of results) {
				i.birthday = moment(i.birthday).format(fm);
			}
			output.rows = results;
			output.user = req.session.loginUser || {};
			res.json(output);
		})
		.catch(ex => {});
});

router.get("/list/:page?", async (req, res) => {
	const output = await getDataByPage(req);
	res.json(output);
});

router.get("/:page?", async (req, res) => {
	const output = await getDataByPage(req);
	res.render("address-book/list", output);
});
router.get("/:page?", getDataByPage);

module.exports = router;
