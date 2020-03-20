const express = require("express");
const router = express.Router();

router.get("/admin02/:action?/:id?", (req, res) => {
	res.json(req.params);
});

module.exports = router;
