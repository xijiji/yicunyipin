var fs = require('fs');
var path = require('path');
var sha1 = require('sha1');
var express = require('express');
var router = express.Router();

var UserModel = require('../models/users');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

//GET /signup注册页
router.get('/', checkNotLogin, function(req, res, next) {
  res.render('signup');
});

//POST /signup 用户注册
router.post('/', checkNotLogin, function(req, res, next) {
  var name = req.fields.name;
  var password = req.fields.password;
  var repassword = req.fields.repassword;
  var address = req.fields.address;
  var phone = req.fields.phone;

  try {
    if(!(name.length >= 1 && name.length <= 20)) {
      throw new Error('名字请限制在1-20个字符');
    }
    if(password.length < 6) {
      throw new Error('密码至少6个字符');
    }
    if(password !== repassword) {
      throw new Error('两次输入密码不一致');
    }
    if(!(/^1\d{10}$/.test(phone) || /^0\d{2,3}-?\d{7,8}$/.test(phone))){
      throw new Error('输入电话不正确');
    }
  } catch(e) {
    req.flash('error', e.message);
    return res.redirect('/signup');
  }

  //明文密码加密
  password = sha1(password);

  //待写入数据库的用户信息
  var user = {
    name: name,
    password: password,
    address: address,
    phone: phone,
    role: 1
  };

  //用户信息写入数据库
  UserModel.create(user)
    .then(function(result) {
      //此user插入mongodb后的值，包含_id
      user = result.ops[0];
      //将用户信息存入session
      delete user.password;
      req.session.user = user;
      //写入flash
      req.flash('success', '注册成功');
      //跳转到首页
      res.redirect('/product');
    })
    .catch(function(e) {
      //用户名被占用则跳回注册页，而不是错误页
      if(e.message.match('E11000 duplicate key')) {
        req.flash('error', '用户名已被占用');
        return res.redirect('/signup');
      }
      next(e);
    });
});

module.exports = router;