require('../lib/db');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'); 
var user = mongoose.model('user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/login', function(req, res, next){
  user.findOne()
  .where('account').equals(req.body.account)
  .where('password').equals(req.body.password).exec(function(err, _user){
      if(err) next(err);
      else if(_user != null){
        req.session.user = _user;
        res.send("success");
      }
      else res.send("錯誤的帳號或密碼！");
  });
});


module.exports = router;
