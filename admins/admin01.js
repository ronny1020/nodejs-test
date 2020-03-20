module.exports = app => {
	app.get("/admin01/:action/:id", (req, res) => {
		res.json(req.params);
	});
};
