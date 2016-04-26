var express = require('express');
var crypto = require('crypto');
var User = require('../models/user.js');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '主页' });
});

router.get('/reg', function(req, res) {
  res.render('reg', { title: '注册' });
});

router.post('/reg', function(req, res) {
    var name = req.body.name,
        password = req.body.password,
        password_re = req.body["password-repeat"];

    if (password_re != password) {
        req.flash('error', '两次输入的密码不一样');
        return res.redirect('/reg');
    }

    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    var newUser = new User({
        name: name,
        password: password,
        email: req.body.email
    });

    User.get(newUser.name, function(err, user) {
        if (err) {
             req.flash('error', err);
             return res.redirect('/');
        }

        if (user) {
            req.flash('error', '用户已经存在');
            return res.redirect('/reg');
        }
   
        newUser.save(function(err, user) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/reg');
            }

            req.session.user = newUser;
            req.flash('success', '注册成功');
            res.redirect('/');
        });
    });
});

router.get('/login', function(req, res) {
  res.render('login', { title: '登录' });
});

router.post('/login', function(req, res) {
});

router.get('/post', function(req, res) {
  res.render('post', { title: '发表' });
});

router.post('/post', function(req, res) {
});

router.get('/logout', function(req, res) {
});
module.exports = router;
