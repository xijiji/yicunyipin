module.exports = {
  port: 5000,
  session: {
    secret: 'yicunyipin',
    key: 'yicunyipin',
    maxAge: 2592000000 //设置有效期，应该是设置的30天
  },
  mongodb: 'mongodb://localhost:27017/yicunyipin'
}