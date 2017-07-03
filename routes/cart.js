var express = require('express');
var router = express.Router();

var ProductModel = require('../models/products');
var CartModel = require('../models/carts');
var checkLogin = require('../middlewares/check').checkLogin;

//POST /cart/:productId/addCart 加入购物车
router.get('/:productId/addCart', checkLogin, function(req, res, next) {
  var uId = req.session.user._id;
  var itemId = req.params.productId;
  ProductModel.getProductById(itemId)
    .then(function (product) {
      var item = {
        itemId: product._id,
        name: product.name,
        price: product.price,
        quantity: 0,
        img: product.avatar
      };
      CartModel.create(uId, item)
        .then(function(result) {
          req.flash('success', ' 添加成功');
          res.redirect(`/product`);
        })
        .catch(next);
    });  
});

//GET /cart?user=xxx 我的购物车
router.get('/', function(req, res, next) {
  var user = req.query.user;
  CartModel.getItems(user)
    .then(function(cart) {
      res.render('cart', {
        cart: cart
      });
    })
    .catch(next);
});

//GET /cart/:itemId/delete 删除购物车中的某个物品
router.get('/:itemId/delete', function(req, res, next) {
  var uId = req.session.user._id;
  var itemId = req.params.itemId;
  CartModel.delCartItem(uId, itemId)
    .then(function(cart) {
      req.flash('success', '删除成功');
      res.redirect(`/cart?user=${uId}`);
    })
    .catch(next);
});

module.exports = router;
