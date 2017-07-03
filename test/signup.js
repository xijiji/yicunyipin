var path = require('path');
var assert = require('assert');
var request = require('supertest');
var app = require('../index');
var User = require('../lib/mongo').User;

var testName1 = 'testName1';
var testName2 = 'nsbmw';
describe('signup', function() {
  describe('POST /signup', function() {
    var agent = request.agent(app);
    beforeEach(function(done) {
      //创建一个用户
      User.create({
        name: testName1,
        password: '123456',
        phone: '',
        address: '',
        role: 1
      })
      .exec()
      .then(function() {
        done();
      })
      .catch(done);
    });

    afterEach(function(done) {
      //删除测试账户
      User.remove({name: {$in: [testName1, testName2]}})
        .exec()
        .then(function() {
          done();
        })
        .catch(done);
    });

    //用户名错误的情况
    it('wrong name', function(done) {
      agent
        .post('/signup')
        .type('form')
        .field({name: ''})
        .redirects()
        .end(function(err, res) {
          if(err) return done(err);
          assert(res.next.match(/名字请限制在1-10个字符/));
          done();
        });
    });

    //其余的参数测试自行补充
    //用户名被占用的情况
    it('duplicate name', function(done) {
      agent
        .post('/signup')
        .type('form')
        .field({name: testName1, phone: '18810764655', address: '北京 海淀', role: 1, password: '123456', repassword: '123456'})
        .redirects()
        .end(function(err, res) {
          if(err) return done(err);
          assert(res.text.match(/用户名已被占用/));
          done();
        });
    });

    //注成功的情况
    it('success', function(done) {
      agent
        .post('/signup')
        .type('form')
        .field({name: testName2, phone: '18810764655', address: '北京 海淀', role: 1, password: '123456', repassword: '123456'})
        .redirects()
        .end(function(err, res) {
          if(err) return done(err);
          assert(res.next.match(/注册成功/));
        });
    });
  });
});