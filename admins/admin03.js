const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
	res.locals.memberData = {
		name: "Tom",
		age: 30
	};
	next();
}); //middleware

router.get("/:action?/:id?", (req, res) => {
	res.json({
		params: req.params,
		url: req.url,
		baseUrl: req.baseUrl,
		locals: res.locals
	});
});

module.exports = router;
