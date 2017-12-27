require('../lib/db');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'); 
var user = mongoose.model('user');
var course = mongoose.model('course');
var department = mongoose.model('department');
var assignment = mongoose.model('assignment');
var studentAssignment = mongoose.model('studentAssignment');
var path = require('path');
var fs = require('fs');
var util = require('util');
var formidable = require('formidable');

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
      req.session.curCourseId = req.params.courseId;
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
    studentAssignment.find()
    .where('assignmentId').equals(req.params.assignmentId)
    .populate({path: 'studentAccount'})
    .exec( function(err, _studentAssignment) {
      res.render('correct', { user : _user, studentAssignment: _studentAssignment, assignmentName: req.session.curAssignmentName, courseId: req.session.curCourseId });
    })
  })
});

router.get('/createAssignment/:courseId', function(req, res, next) {
  user.findById(req.session.user._id)
  .populate({path: 'courses', populate: {path: 'classid'}})
  .populate('classid')
  .exec( function(err, _user) {
    course.findById(req.params.courseId)
    .populate('assignment')
    .exec( function(err, _course) {
      req.session.curCourseId = req.params.courseId;
      res.render('createAssignment', { user : _user, course: _course });
    })
  })
});

router.get('/assignment/:assignmentId', function(req, res, next) {
  user.findById(req.session.user._id)
  .populate({path: 'courses', populate: {path: 'classid'}})
  .populate('classid')
  .exec( function(err, _user) {
    assignment.findById(req.params.assignmentId)
    .populate('courseid')
    .exec( function(err, _assignment) {
      req.session.curAssignmentId = req.params.assignmentId;
      req.session.curAssignmentName = _assignment.name;
      var filePath = path.join(__dirname, '../public/assignment/') + req.session.user.account + '_' + req.session.curAssignmentId + '.zip';
      fs.exists(filePath, function(ex){
        if(ex){
          res.render('assignment', { user : _user, assignment: _assignment, fileName: req.session.user.account + '_' + req.session.curAssignmentId + '.zip' });
        }
        else{
          res.render('assignment', { user : _user, assignment: _assignment, fileName: "" });
        }
      });
    })
  })
});

router.get('/editAssignment/:assignmentId', function(req, res, next) {
  user.findById(req.session.user._id)
  .populate({path: 'courses', populate: {path: 'classid'}})
  .populate('classid')
  .exec( function(err, _user) {
    assignment.findById(req.params.assignmentId)
    .populate({path: 'courseid', populate: {path: 'studentAccount'}})
    .exec( function(err, _assignment) {
      res.render('editAssignment', { user : _user, assignment: _assignment });
    })
  })
});

router.get('/stastic', function(req, res, next) {
  res.render('stastic', { title: 'Express' });
});

router.post('/uploadAssignment', function(req, res, next){
  var form = new formidable.IncomingForm();
  form.maxFieldsSize = 5 * 1024 * 1024;
  form.keepExtensions = true;
  form.encoding = 'utf-8';

  form.parse(req, function (err, fields, file) {
    var filePath = '';
    if(file.selectFile) filePath = file.selectFile.path;
   
    var targetDir = path.join(__dirname, '../public/assignment');
    if (!fs.existsSync(targetDir)) {
        fs.mkdir(targetDir);
    }

    var fileExt = filePath.substring(filePath.lastIndexOf('.'));
   
    if (('.zip').indexOf(fileExt.toLowerCase()) === -1)
    {
        var err = new Error('上傳檔案非zip！');
        res.json({code:-1, message:'上傳檔案非zip！'});
    }
    else
    {
      var fileName = req.session.user.account + '_' + req.session.curAssignmentId + fileExt;
      var targetFile = path.join(targetDir, fileName);

      // 系統位於C:/時
      //fs.renameSync(filePath, targetFile);
      //系統位於C:/以外時
      var readStream = fs.createReadStream(filePath)
      var writeStream = fs.createWriteStream(targetFile);
      
      readStream.pipe(writeStream);
      readStream.on('end',function() {
          fs.unlinkSync(filePath);
      });
      studentAssignment.findOne()
      .where('assignmentId').equals(req.session.curAssignmentId)
      .where('studentAccount').equals(req.session.user.account).exec(function(err, _studentAssignment){
        if(err) next(err);
        else if(_studentAssignment == null) res.send("Database update fail.");
        else{
          _studentAssignment.fileURL = fileName;
          _studentAssignment.save(function(err){
            console.log("Student assignment save suceess.");
          });
        }
      });
      res.redirect('/pass/assignmentList/' + req.session.curCourseId);
    }
  });
});

router.get('/assignment/download/:fileName', function(req, res, next) {
  var filePath = path.join(__dirname, '../public/assignment/') + req.params.fileName;
  res.download(filePath, filePath, function(err){
    if (err) {
      next(err);
    } else {
      res.end();
    }
  });
});

router.post('/createAssignment', function(req, res, next){
  assignment.findOne()
  .where('name').equals(req.body.name)
  .exec(function(err, _assignment){
      if(err) {
        next(err);
      }
      else if(_assignment != null){
        res.send("作業名稱重複！！");
      }
      else {
        assignment.create(req.body, function(err, _assignment) {
          course.findOneAndUpdate({_id: _assignment.courseid}, {"$push": { assignment: _assignment._id }}, function(err, _course) {
            _course.studentAccount.forEach(function(student){
              var newStudentAssignment = new studentAssignment({
                assignmentId : _assignment._id,
                studentAccount : student
              });
              newStudentAssignment.save(function(err){
                if(err) next(err);
              });
            });
          });
        });
        res.send("success");
      }
  });
});

router.patch('/editAssignment', function(req, res, next){
  assignment.findOneAndUpdate({_id: req.body._id}, req.body, function(err, _assignment) {
    res.send("success");
  });
});

module.exports = router;

