var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/course', function(req, res, next) {
  res.render('course', { title: 'Express' });
});

router.get('/courseList', function(req, res, next) {
  res.render('courseList', { title: 'Express' });
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
