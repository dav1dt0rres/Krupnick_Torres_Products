var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('INSIDE get FUNCTION');
  res.send('respond with a resource');
});
router.get('/login',function(req, res) {
  console.log('INSIDE LOGIN FUNCTION');
  res.render("dashboard");
});
router.get('/callback',function(req, res) {
  console.log('INSIDE callback FUNCTION');
  res.render("dashboard");
});
module.exports = router;
