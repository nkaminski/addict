const basicAuth = require('express-basic-auth');
module.exports = (app, authinfo) => {
  // auth middleware
  app.use(basicAuth({
    users: authinfo,
    challenge: true,
  }));
}
