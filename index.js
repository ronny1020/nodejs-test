const express = require("express");

const url = require("url");

const multer = require("multer");
const fs = require("fs");
const upload = multer({ dest: "temp_uploads" });

const app = express();

const uuid = require("uuid");

const session = require("express-session");

const moment = require("moment-timezone");

const db = require("./src/db_connect");

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
	session({
		saveUninitialized: false,
		resave: false,
		secret: "lorem",
		cookie: {
			maxAge: 1200000
		}
	})
);

app.use((req, res, next) => {
	if (req.session.loginUser) {
		res.locals.loginUser = req.session.loginUser;
	} else {
		res.locals.loginUser = {};
	}

	next();
});
app.use("/address_book", require(__dirname + "/routes/address_book"));

app.get("/", (req, res) => {
	// res.send(`<h2>Hello world</h2>`);
	res.render("home", { name: "Tom" });
});

app.get("/2", (req, res) => {
	res.send(`<h2>Hello world 2</h2>`);
});

app.get("/sales-json", (req, res) => {
	const sales = require("./data/sales");
	res.render("sales-table", { sales: sales });
});

app.get("/try-qu", (req, res) => {
	const output = {
		url: req.url
	};
	output.urlParts = url.parse(req.url, true);
	res.json(output);
});

app.get("/try-post", (req, res) => {
	res.render("try-post-form");
});

app.post("/try-post", (req, res) => {
	res.json(req.body);
});

app.post("/try-upload", upload.single("avatar"), (req, res) => {
	const output = {
		body: req.body,
		file: req.file
	};
	console.log(req.file);
	if (req.file && req.file.originalname) {
		let ext = "";
		switch (req.file.mimetype) {
			case "image/jpeg":
				ext = ".jpg";
				break;
			case "image/png":
				ext = ".png";
				break;
			case "image/gif":
				ext = ".gif";
				break;
		}
		if (ext) {
			let fileName = uuid.v4() + ext;
			output.newName = fileName;
			fs.rename(req.file.path, "./public/img/" + fileName, error => {});
		} else {
			fs.unlink(req.file.path, error => {});
		}
	}

	res.json(output);
});

app.get("/try-params1/:action/:id", (req, res) => {
	res.json(req.params);
});

app.get(/^\/mobile\/09\d{2}\-?\d{3}\-?\d{3}$/, (req, res) => {
	let m = req.url.slice(8);
	m = m.split("?")[0];
	m = m.split("-").join("");
	res.json({ url: m });
});

require(__dirname + "/admins/admin01")(app);
app.use(require(__dirname + "/admins/admin02"));
app.use("/admin03", require(__dirname + "/admins/admin03"));

app.get("/try-session", (req, res) => {
	req.session.my_var = req.session.my_var || 0;
	req.session.my_var++;
	res.json({
		my_var: req.session.my_var,
		session: req.session
	});
});

app.use("/member", require(__dirname + "/routes/member"));
app.get("/sess", (req, res) => {
	res.json(req.session);
});

app.get("/try-moment", (req, res) => {
	const fm = "YYY-MM-DD HH:mm:ss";
	const m1 = moment(req.session.cookie.expires);
	const m2 = moment(new Date());
	const m3 = moment(03 / 06 / 19);

	res.json({
		"local-m1": m1.tz("Europe/London").format(fm),
		"local-m2": m2.tz("Europe/London").format(fm),
		"local-m3": m3.tz("Europe/London").format(fm)
	});
});

app.get("/try-db", (req, res) => {
	const sql = "SELECT * FROM address_book LIMIT 3";
	db.query(sql, (error, result, fields) => {
		if (error) {
			console.log(error);
		} else {
			res.json(result);
		}
	});
	// const sql = "UPDATE `address_book` SET name=?, email=? where sid=2";
	// db.query(sql, ["陳小華", "23213@gmail.com"], (error, result) => {
	// 	if (error) {
	// 		console.log(error);
	// 	} else {
	// 		res.json(result);
	// 	}
	// });
	// const sql = "INSERT INTO `test`.`address_book` (`name`, `email`, `mobile`, `birthday`, `address`) VALUES (?,?,?,?,?)";

	// db.query(sql, ["張大華", "2dsf3213@gmail.com","0937204444","1988-10-20","Taipei"], (error, result) => {
	// 	if (error) {
	// 		console.log(error);
	// 	} else {
	// 		res.json(result);
	// 	}
	// });
});



app.use(express.static("public"));

app.use((req, res) => {
	res.type("text/html");
	res.status = 404;

	res.send(`path:${req.url} <br> <h2> 404 -page not found</h2>`);
});

app.listen(3000, () => {
	console.log("server start");
});
