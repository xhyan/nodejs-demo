var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('./../models/User.js');
/* GET home page. */
//index页面
router.get('/', function (req, res) {
    res.render('index', {
        title: 'Index',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
});

//注册页面
router.get('/register', function (req, res) {
    res.render('./register/register', {
        title: '用户注册',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
});

//提交注册信息
router.post('/register', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var password_re = req.body['password-repeat'];
    //检测两次输入的密码是否一致
    if (password != password_re) {
        req.flash('error', '两次输入的密码不一致');
        return res.redirect('/register');
    }
    //generate md5 for password
    var md5 = crypto.createHash('md5');
    var password_real = md5.update(req.body.password).digest('hex');

    var newUser = new User({
        username: username,
        password: password_real,
        email: req.body.email
    });
    //check username is existed
    User.get(newUser.username, function (err, user) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        }
        if (user) {
            req.flash('error', '该用户名已存在!');
            return res.redirect('/register');
        }
        //create new user
        newUser.save(function (err, user) {
            if (err) {
                req.flash('err', err);
                return res.redirect('/register');//注册失败，返回注册页面
            }
            req.session.user = user;//用户信息存入session
            req.flash('success', '注册成功!');
            res.redirect('/login');
        });
    });
});

//登陆页面
router.get('/login', function (req, res) {
    res.render('./login/login', {
        title: '用户登录',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
});

//登陆请求
router.post('/login', function (req, res) {
    //生成密码的MD5序列
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('hex');
    //检查用户是否存在
    User.get(req.body.username, function (err, user) {
        if (!user) {
            req.flash('error', '用户不存在!');
            return res.redirect('/login');//跳转登录页面
        }
        //检查密码是否一致
        if (user.password != password) {
            req.flash('error', '密码错误');
            return res.redirect('/login');//密码错误，调转到登录页面
        }
        //用户名密码都匹配，将用户信息存入session
        req.session.user = user;
        req.flash('success', '登陆成功');
        res.redirect('/home');//登陆成功，跳转home页面
    });
});

router.get('/logout', function (req, res) {
    req.session.user = null;
    req.flash('success', '登出成功');
    res.redirect('/');
});

router.get('/home', function (req, res) {
    res.render('./login/home', {
        title: '主页',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
});

module.exports = router;

