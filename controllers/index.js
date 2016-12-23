

module.exports.home = function *home(ctx) {
  // this.body = {msg:'hello koa!!!'};
  this.redirect('/index.html');
};
