const express = require("express");

const url = require("url");

const multer = require("multer");
const fs = require("fs");
const upload = multer({ dest: "temp_uploads" });

const app = express();

const uuid = require("uuid");

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

app.use(express.static("public"));

app.use((req, res) => {
	res.type("text/html");
	res.status = 404;

	res.send(`path:${req.url} <br> <h2> 404 -page not found</h2>`);
});

app.listen(3000, () => {
	console.log("server start");
});
