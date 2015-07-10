var express = require('express');
var router = express.Router();

/* GET home page. */
//index页面
router.get('/', function (req, res) {
    res.render('index', {title: 'Index'});
});

//登陆页面
router.get('/login', function (req, res) {
    res.render('./login/login', {title: '用户登录'});
});
//登陆请求
router.post('/login', function (req, res) {
    var user = {
        username: 'admin',
        password: 'admin'
    };
    //验证登录名密码
    if (req.body.username == user.username && req.body.password == user.password) {
        res.redirect('/home')
    }
    else {
        res.redirect('/login');
    }
});

router.get('/logout', function (req, res) {
    res.redirect('/');
});

router.get('/home', function (req, res) {
    var user = {
        username: 'admin',
        password: 'admin'
    };

    res.render('./login/home', {title: 'Home', user: user});
});

module.exports = router;

