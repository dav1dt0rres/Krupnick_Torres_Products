var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('inside index router');
  res.render('index', {
    title: 'Welcome to the Krupnick Approach!',
    user: req.user,
  })

});

module.exports = router;
