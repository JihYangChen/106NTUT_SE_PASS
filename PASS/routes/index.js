var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/course', function(req, res, next) {
  res.render('course', { title: 'Express' });
});

module.exports = router;
