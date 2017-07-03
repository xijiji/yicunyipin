var fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();

var ProductModel = require('../models/products');
var checkLogin = require('../middlewares/check').checkLogin;

//GET /product 首页
router.get('/', function(req, res, next) {
  ProductModel.getProducts()
    .then(function (products) {
      res.render('product', {
        products: products
      });
    })
    .catch(next);
});

//GET /product/addProduct 添加商品
router.get('/addProduct', checkLogin, function(req, res, next) {
  res.render('addProduct');
})

//POST /product 添加一件商品
router.post('/addProduct', checkLogin, function(req, res, next) {
  var name = req.fields.name;
  var price = req.fields.price;
  var describe = req.fields.describe;
  var place = req.fields.place;
  var category = req.fields.category;
  var avatar = req.files.avatar.path.split(path.sep).pop();

  try {
    if (!req.files.avatar.name) {
      throw new Error('缺少头像');
    }
    if(!name.length) {
      throw new Error('请填写产品名称');
    }
    if(!category.length) {
      throw new Error('请填写种类名称');
    }
    if(price==null){
      throw new Error('请填写产品价格');
    }

  } catch (e) {
    req.flash('error', e.message);
    return res.redirect('back');
  }

  var product = {
    name: name,
    price: price,
    describe: describe,
    avatar: avatar,
    category: category,
    place: place,
    pv: 0
  };

  ProductModel.create(product) 
    .then(function(result) {
      //此product是插入mongodb后的值，包含_id
      post = result.ops[0];
      req.flash('success', '添加成功');
      //发表成功后跳转到首页
      res.redirect(`/product`);
    })
    .catch(next);
});

module.exports = router;