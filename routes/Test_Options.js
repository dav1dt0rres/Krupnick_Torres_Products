const express = require('express')
const Question = require('../Objects/Question.js');
var Database=require('../Objects/Database.js');
const Student = require('../Objects/Student.js');

const router = express.Router()
var counter=0;
var timer;

var descriptionList=[];
var Responses=[];
var mySet;
var Database_Object;
var Question_object;
var Student_Object;
var title;

router.get('/', function (req, res, next) {
    console.log("Inside get Test Optoins"+req.query.FirstName+req.query.LastName)
    if( req.query.hasOwnProperty("ACT_Button")){
        title="Are you ready?"+req.query.FirstName+"to take the ACT?"
        res.render('Test_Options',{title, Test_Type:"ACT"})
    }
    if( req.query.hasOwnProperty("SAT_Button")){
        console.log("SAT Button clicked");
    }




})
router.get('/ACT', function (req, res, next) {
    //const { profile } = req.user

        console.log("inside Test_Options ACT"+req.body.FirstName)


}
)

router.post('/', function (req, res, next) {
    //We already know what test to do and time limits and everything, this is when the database should
    //be initialized


    console.log("Inside post in Test_Options"+req.body.Time_Limit)

})


module.exports = router