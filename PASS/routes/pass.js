require('../lib/db');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'); 
var user = mongoose.model('user');
var course = mongoose.model('course');
var department = mongoose.model('department');
var assignment = mongoose.model('assignment');
//var fs = require('fs');
//var path = require('path');

router.use(function (req, res, next) {
    if(req.session.user == null){
        res.redirect('/');
    } else {
      next();
    }
});

router.get('/course', function(req, res, next) {
  res.render('course', { title: 'Express' });
});

router.get('/courseList', function(req, res, next) {
  user.findById(req.session.user._id)
  .populate({path: 'courses', populate: {path: 'classid'}})
  .populate('classid')
  .exec( function(err, _user) {
    res.render('courseList', { user : _user });
  })
});

router.get('/assignmentList/:courseId', function(req, res, next) {
  user.findById(req.session.user._id)
  .populate({path: 'courses', populate: {path: 'classid'}})
  .populate('classid')
  .exec( function(err, _user) {
    course.findById(req.params.courseId)
    .populate('assignment')
    .exec( function(err, _course) {
      res.render('assignmentList', { user : _user, course: _course });
    })
  })
});

router.get('/memberList', function(req, res, next) {
  res.render('memberList', { title: 'Express' });
});

router.get('/correct/:assignmentId', function(req, res, next) {
  user.findById(req.session.user._id)
  .populate({path: 'courses', populate: {path: 'classid'}})
  .populate('classid')
  .exec( function(err, _user) {
    assignment.findById(req.params.assignmentId)
    .populate({path: 'courseid', populate: {path: 'studentAccount'}})
    .exec( function(err, _assignment) {
      res.render('correct', { user : _user, assignment: _assignment });
    })
  })
});

router.get('/createAssignment', function(req, res, next) {
  res.render('createAssignment', { title: 'Express' });
});

router.get('/assignment/:assignmentId', function(req, res, next) {
  user.findById(req.session.user._id)
  .populate({path: 'courses', populate: {path: 'classid'}})
  .populate('classid')
  .exec( function(err, _user) {
    assignment.findById(req.params.assignmentId)
    .populate('courseid')
    .exec( function(err, _assignment) {
      res.render('assignment', { user : _user, assignment: _assignment });
    })
  })
});

router.get('/editAssignment', function(req, res, next) {
  res.render('editAssignment', { title: 'Express' });
});

router.get('/stastic', function(req, res, next) {
  res.render('stastic', { title: 'Express' });
});

module.exports = router;

