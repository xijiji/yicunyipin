var config = require('config-lite')(__dirname);
var Mongolass = require('mongolass');
var mongolass = new Mongolass();
mongolass.connect(config.mongodb);

var moment = require('moment');
var objectIdToTimestamp = require('objectid-to-timestamp');

//根据id生成创建时间 create_at
mongolass.plugin('addCreatedAt', {
  afterFind: function(results) {
    results.forEach(function(item) {
      item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
    });
    return results;
  },
  afterFindOne: function(result) {
    if(result) {
      result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
    }
    return result;
  } 
});

exports.User = mongolass.model('User', {
  name: {type: 'string'},
  password: {type: 'string'},
  phone: {type: 'string'},
  address: {type: 'string'},
  role: {type: 'number'}
});
exports.User.index({name: 1}, {unique: true}).exec(); //根据用户名找到用户，用户名全局唯一

exports.Product = mongolass.model('Product', {
  name: {type: 'string'},
  price: {type: 'string'},  //记得之后要改成double类型的
  describe: {type: 'string'},
  place: {type: 'string'},
  avatar: {type: 'string'},
  category: {type: 'string'},
  pv: {type: 'number'}
});
exports.Product.index({pv:1, _id:-1}).exec(); //希望能够按照购买量从高到低进行显示，不知道可不可以

exports.Cart = mongolass.model('Cart', {
  uId: {type: Mongolass.Types.ObjectId}, //与当前用户进行关联
  status: {type: Boolean, default: false}, //是否提交订单，默认是否
  items: [
    {
      itemId: {type: Mongolass.Types.ObjectId}, //与产品id进行关联
      name: {type: 'string'},
      price: {type: 'string'},
      quantity: {type: 'number'},
      img: {type: 'string'}
    }
  ] //想使用嵌套的方式 实现购物车的功能，不知道行不行
});

exports.Cart.index({uId: 1, _id: 1}).exec();
exports.Cart.index({itemId: 1, _id: 1}).exec();