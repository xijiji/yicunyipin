var Cart = require('../lib/mongo').Cart;

module.exports = {
  create: function create(uId, item) {
    return Cart
      .update( //存在的bug 当一个新的用户注册之后，需要先insert，然后再update，不然就会出现错误，等再熟悉一下mongodb看看解决方法
        {'uId': uId, 'status': false},
        {$addToSet: {   //$addToSet:功能与$push相同，区别在于，$addToSet把数组看作成一个Set,如果数组中存在相同的元素，不会插入。
          'items': item
          }})
      .exec();
  },

//按照创建时间降序展示某个用户的购物车
  getItems: function getItems(user) {
    return Cart
      .findOne({uId: user})
      .exec();
  },

  //删除购物车中的某一项
  delCartItem: function delCartItem(uId, itemId) {
    return Cart.update({'uId': uId}, {$pull: {'items':{'itemId':itemId}}})
      .exec();
  }
};