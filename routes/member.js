const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
	res.render("member/login");
});

router.post("/login", (req, res) => {
	const users = {
		tom01: {
			name: "Tom",
			pw: "123"
		},
		sam01: {
			name: "Sam",
			pw: "123"
		}
	};
	const output = {
		success: false,
		error: "Account or password is wrong."
	};

	if (req.body.account && users[req.body.account]) {
		if (req.body.password === users[req.body.account].pw) {
			req.session.loginUser = {
				account: req.body.account,
				name: users[req.body.account].name
			};
			output.success = true;
			delete output.error;
		}
	}

	res.json(output);
});

router.get('/logout', (req,res)=>{
	delete req.session.loginUser;
	res.redirect('/');
})

module.exports = router;
