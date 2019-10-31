
const express = require('express')
var mongoose = require( 'mongoose' )
var Reading_table = mongoose.model('ReadingQuestion');
var Database=require('../Objects/Database.js');
const router = express.Router();
const Question = require('../Objects/Question.js');
var Current_Sessions=[]


router.get('/', function (req, res, next) {

    console.log("Rendering Edit Question")

    Database_Object=new Database();

    var Question_object= Database_Object.SearchQuestion(req.body.Number);


    title="This is the Recalled Question"
    res.render('AddQuestions',{ title })

})

router.post('/', async function (req, res, next) {


})

module.exports = router