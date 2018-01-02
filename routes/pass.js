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
var archiver = require('archiver');

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
  .populate({path: 'TACourse', populate: {path: 'classid'}})
  .populate('classid')
  .exec( function(err, _user) {
    res.render('courseList', { user : _user });
  })
});

router.get('/assignmentList/:courseId', function(req, res, next) {
  user.findById(req.session.user._id)
  .populate({path: 'courses', populate: {path: 'classid'}})
  .populate({path: 'TACourse', populate: {path: 'classid'}})
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

router.get('/memberList/:courseId', function(req, res, next) {
  user.findById(req.session.user._id)
  .populate({path: 'courses', populate: {path: 'classid'}})
  .populate({path: 'TACourse', populate: {path: 'classid'}})
  .populate('classid')
  .exec( function(err, _user) {
    course.findById(req.params.courseId)
    .populate({path: 'TA', populate: {path: 'classid'}})
    .populate({path: 'studentAccount', populate: {path: 'classid'}})
    .exec( function(err, _course) {
      res.render('memberList', { user : _user, course: _course });
    })
  })
});

router.get('/correct/:assignmentId', function(req, res, next) {
  user.findById(req.session.user._id)
  .populate({path: 'courses', populate: {path: 'classid'}})
  .populate({path: 'TACourse', populate: {path: 'classid'}})
  .populate('classid')
  .exec( function(err, _user) {
    assignment.findById(req.params.assignmentId)
    .populate('courseid')
    .exec( function(err, _assignment) {
      studentAssignment.find()
      .where('assignmentId').equals(req.params.assignmentId)
      .populate({path: 'studentAccount'})
      .exec( function(err, _studentAssignment) {
        res.render('correct', { user : _user, studentAssignment: _studentAssignment, assignment: _assignment, courseId: req.session.curCourseId });
      })
    })
  })
});

router.get('/createAssignment/:courseId', function(req, res, next) {
  user.findById(req.session.user._id)
  .populate({path: 'courses', populate: {path: 'classid'}})
  .populate({path: 'TACourse', populate: {path: 'classid'}})
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
  .populate({path: 'TACourse', populate: {path: 'classid'}})
  .populate('classid')
  .exec( function(err, _user) {
    assignment.findById(req.params.assignmentId)
    .populate('courseid')
    .exec( function(err, _assignment) {
      req.session.curAssignmentId = req.params.assignmentId;
      req.session.curAssignmentName = _assignment.name;
      var filePath = path.join(__dirname, '../public/assignment/' + req.session.curAssignmentId + '/') + req.session.user.account + '_' + req.session.curAssignmentId + '.zip';
      fs.exists(filePath, function(ex){
        studentAssignment.findOne({studentAccount: req.session.user._id, assignmentId: req.session.curAssignmentId}, function(err, _studentAssignment) {
          var _score = null, _comment="";
          
          if(_studentAssignment != null) {
            if(_studentAssignment.score == null)
              _score = "-";
            else{
              _score = _studentAssignment.score;
              if(_studentAssignment.comment == "")
                _comment = " 分" + _studentAssignment.comment;
              else
                _comment = " 分，" + _studentAssignment.comment;
            }
          }

          if(ex){
            res.render('assignment', { user : _user, assignment: _assignment, score: _score, comment: _comment, 
                                        fileName: req.session.user.account + '_' + req.session.curAssignmentId + '.zip' });
          }
          else{
            res.render('assignment', { user : _user, assignment: _assignment, score: _score, comment: _comment, fileName: "" });
          }
        });
      });
    })
  })
});

router.get('/editAssignment/:assignmentId', function(req, res, next) {
  user.findById(req.session.user._id)
  .populate({path: 'courses', populate: {path: 'classid'}})
  .populate({path: 'TACourse', populate: {path: 'classid'}})
  .populate('classid')
  .exec( function(err, _user) {
    assignment.findById(req.params.assignmentId)
    .populate('courseid')
    .populate({path: 'courseid', populate: {path: 'studentAccount'}})
    .exec( function(err, _assignment) {
      res.render('editAssignment', { user : _user, assignment: _assignment });
    })
  })
});

router.get('/statistic/:courseId', function(req, res, next) {
  user.findById(req.session.user._id)
  .populate({path: 'courses', populate: {path: 'classid'}})
  .populate({path: 'TACourse', populate: {path: 'classid'}})
  .populate('classid')
  .exec( function(err, _user) {
    course.findById(req.params.courseId)
    .exec( function(err, _course) {
      req.session.curCourseId = req.params.courseId;
      res.render('statistic', { user : _user, course: _course });
    })
  })
});

router.post('/uploadAssignment', function(req, res, next){
  
  var form = new formidable.IncomingForm();
  form.maxFieldsSize = 5 * 1024 * 1024;
  form.keepExtensions = true;
  form.encoding = 'utf-8';

  form.parse(req, function (err, fields, file) {
    var filePath = '';
    if(file.selectFile) filePath = file.selectFile.path;
   
    var targetDir = path.join(__dirname, '../public/assignment/' + req.session.curAssignmentId);
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
          if(_studentAssignment.fileURL == null){
            assignment.findById(req.session.curAssignmentId, function(err, _assignment){
              _assignment.hanginCount += 1;
              _assignment.save(function(err){
                console.log("已上傳人數增加失敗！");
              });
            });
          }
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
  var filePath = path.join(__dirname, '../public/assignment/'+ req.session.curAssignmentId + '/') + req.params.fileName;
  res.download(filePath, filePath, function(err){
    if (err) {
      next(err);
    } else {
      res.end();
    }
  });
});

router.get('/assignment/downloadAll/:assignmentId', function(req, res, next){
  var targetDir = path.join(__dirname, '../public/assignment/');
  var targetFile = targetDir + '/' + req.params.assignmentId + '.zip';
  var output = fs.createWriteStream(targetFile);
  var archive = archiver('zip');

  archive.on('error', function(err){
      throw err;
  });
  
  output.on('close', function() {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
    res.download(targetFile , targetFile, function(err){
      if (err) next(err);
      else {
        fs.unlink(targetFile, function(err){
          if(err) next(err);
          res.end();
        });
      }
    });
  });

  archive.pipe(output);
  archive.directory(targetDir + '/' + req.session.curAssignmentId, false);
  archive.finalize();
});

router.post('/createAssignment', function(req, res, next) {
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

router.patch('/editAssignment', function(req, res, next) {
  assignment.findOneAndUpdate({_id: req.body._id}, req.body, function(err, _assignment) {
    res.send("success");
  });
});

router.delete('/deleteAssignment', function(req, res, next) {
  assignment.findOneAndRemove({_id: req.body.assignmentId}, function(error, doc, _assignment) {
    course.findByIdAndUpdate(req.body.courseId, { "$pull": { assignment: req.body.assignmentId }}, function (err, doc) {
      studentAssignment.remove({ assignmentId : req.body.assignmentId }, function(err){
        if(err) next(err);
        else res.send("success");
      });
    });
  });
});

router.patch('/correctAssignment', function(req, res, next) {
  var jsonArray = JSON.parse(req.body.data);

  jsonArray.forEach(function(_studentAssignment) {
    studentAssignment.findOneAndUpdate({_id: _studentAssignment._id}, _studentAssignment, function(err, _assignment) {
    });
  });

  setTimeout(function() {
    res.send("success");
  }, 2000);
});

router.get('/statistic/getAvgScores/:courseId', function(req, res, next) {
  var avgScores = [];

  course.findById(req.params.courseId)
  .populate('assignment')
  .exec(function(err, _course) {
    var findCount = 0;
    for (let j=0; j<_course.assignment.length; j++) {
      studentAssignment.find({assignmentId: _course.assignment[j]._id}, function(err, _studentAssignments){
        var totalScore = 0;
        for(var i in _studentAssignments){
          totalScore += _studentAssignments[i].score;
        }

        avgScores[j] = parseFloat((totalScore / _studentAssignments.length).toFixed(2));
        findCount ++;

        if (findCount == _course.assignment.length)
          res.send(avgScores);
      });
    }
  })
});

router.get('/statistic/getPersonalScores/:courseId/:studentId', function(req, res, next) {
  var personalScores = [];

  course.findById(req.params.courseId)
  .populate('assignment')
  .exec(function(err, _course) {
    var findCount = 0;
    for (let j=0; j<_course.assignment.length; j++) {
      studentAssignment.find({assignmentId: _course.assignment[j]._id, studentAccount: req.params.studentId}, function(err, _studentAssignments){
        if (_studentAssignments[0].score)
          personalScores[j] = _studentAssignments[0].score;
        else
          personalScores[j] = 0;
        findCount ++;

        if (findCount == _course.assignment.length)
          res.send(personalScores);
      });
    }
  })
});

router.get('/statistic/getHangin/:courseId', function(req, res, next) {
  var hanginCount = [];

  course.findById(req.params.courseId)
  .populate('assignment')
  .exec(function(err, _course) {
    var findCount = 0;
    for (let j=0; j<_course.assignment.length; j++) {
      assignment.findById(_course.assignment[j]._id, function(err, _assignment){

        hanginCount[j] = _assignment.hanginCount;
        findCount ++;

        if (findCount == _course.assignment.length)
          res.send(hanginCount);
      });
    }
  })
});


module.exports = router;

