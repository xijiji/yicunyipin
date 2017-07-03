module.exports = function(app) {
  app.get('/', function(req, res) {
    res.redirect('/product');
  });

  app.use('/signup', require('./signup'));
  app.use('/signin', require('./signin'));
  app.use('/signout', require('./signout'));
  app.use('/product', require('./product'));
  app.use('/cart', require('./cart'));

  //404 page
  app.use(function(req, res) {
    if(!res.headersSent) {
      res.status(404).render('404');
    }
  });
};
