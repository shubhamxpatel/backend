var express = require('express');
var mongoose=require('mongoose')
var router = express.Router();
var conn=require('../public/javascripts/connect.js')

  
  
   

/* GET home page. */
router.get('/', async function(req, res, next) {
 
  res.render('index', { msg: '' });
});
router.get('/addmovie', function(req, res, next) {
  res.render('addmovie', { title: 'Express' });
});

module.exports = router;
