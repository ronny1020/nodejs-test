const express = require("express");

const app = express();

app.set("view engine", "ejs");

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

app.use(express.static("public"));

app.use((req, res) => {
    res.type("text/html");
    res.status = 404;

    res.send(`path:${req.url} <br> <h2> 404 -page not found</h2>`);
});

app.listen(3000, () => {
    console.log("server start");
});
