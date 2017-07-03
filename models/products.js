var Product = require('../lib/mongo').Product;

module.exports = {
  create: function create(product) {
    return Product.create(product).exec();
  },

  //通过产品id获取产品的详细信息
  getProductById: function getProductById(productId){
    return Product
      .findOne({_id: productId})
      .addCreatedAt()
      .exec();
  },

  //获取所有的产品
  getProducts: function getProducts() {
    return Product
      .find()
      .sort({pv: -1})
      .addCreatedAt()
      .exec();
  },

  incPv: function incPv(productId) {
    return Product
      .update({_id: postId}, {$inc:{pv:1}})
      .exec();
  }
};