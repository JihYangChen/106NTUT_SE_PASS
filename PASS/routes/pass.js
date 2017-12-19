require('../lib/db');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'); 
var user = mongoose.model('user');
var department = mongoose.model('department');
//var fs = require('fs');
//var path = require('path');

router.use(function (req, res, next) {
    if(req.session.userType == null){
        res.redirect('/');
    }
    next();
});

router.get('/course', function(req, res, next) {
  res.render('course', { title: 'Express' });
});

router.get('/courseList', function(req, res, next) {
    console.log("Tansfer courseListPage.");
    res.render('courseList', { user : req.session.user });
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

