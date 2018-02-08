
const app = require('express')();
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cfg = require('config');
const roles = require('./controller/userRoles');
const auth = require('./controller/userAuth');



mongoose.connect(cfg.MongoURI, cfg.MongoOptions,
  function (err) {
    if (err) console.log(err);
  }
);

// Configure passport middleware
app.use(auth.initialize());
app.use(auth.session());

app.use(logger('dev'));
app.use('/api', bodyParser.json());
app.use('/api', roles.middleware());
app.use('/api', require('./route'));

app.use('/api', function (err, req, res, next) {
  if (err) {
    res.status(err.statusCode >=100 && err.statusCode < 600 ? err.statusCode: 500 ).json({ 'message': err.message, 'error': err });
  }
});

module.exports = app;