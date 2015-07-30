var express = require('express');
var router = express.Router();

/* GET home page. */
app.get('/', function (req, res) {
	Post.get(null, function (err, posts) {
		if (err) {
			posts = [];
		}
		res.render('index', {
			title: '主页',
			user: req.session.user,
			posts: posts,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});
});

module.exports = router;
