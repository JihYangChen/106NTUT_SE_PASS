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
  .where('email').equals(req.body.email)
  .where('password').equals(req.body.password).exec(function(err, _user){
      console.log(_user);
      if(err) next(err);
      else if(_user != null){
        req.session.user = _user._id;
        if(_user.classid == null) req.session.userType = 0;
        else req.session.userType = 1;
        res.send("success");
      }
      else res.send("錯誤的帳號或密碼！");
  });
});


router.get('/assignmentList', function(req, res, next) {
  res.render('assignmentList', { title: 'Express' });
});

router.get('/memberList', function(req, res, next) {
  res.render('memberList', { title: 'Express' });
});

router.get('/correct', function(req, res, next) {
  res.render('correct', { title: 'Express' });
});

router.get('/createAssignment', function(req, res, next) {
  res.render('createAssignment', { title: 'Express' });
});

router.get('/assignment', function(req, res, next) {
  res.render('assignment', { title: 'Express' });
});

router.get('/editAssignment', function(req, res, next) {
  res.render('editAssignment', { title: 'Express' });
});

router.get('/stastic', function(req, res, next) {
  res.render('stastic', { title: 'Express' });
});
module.exports = router;
