const express = require("express");
const router = express.Router();

router.get("/:action?/:id?", (req, res) => {
	res.json({
		params: req.params,
		url: req.url,
		baseUrl: req.baseUrl,
	});
});

module.exports = router;
