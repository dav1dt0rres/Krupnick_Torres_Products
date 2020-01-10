
var fs              = require('fs')
const express = require('express')
const Question = require('../Objects/Question.js');
var Database=require('../Objects/Database.js');
const Student = require('../Objects/Student.js');

const router = express.Router()
var counter=0;
var timer;

var title;
var {JSDOM} = require("jsdom");
var jsdom=require("jsdom")
var data = fs.readFileSync('C:\\Users\\david\\Downloads\\Krupnick_Approach-dev\\views\\Test_Options.hbs','utf-8');
var document = new JSDOM(data).window.document;
router.get('/', async function (req, res, next) {
    console.log("Inside get Test Optoins"+req.query.FirstName+req.query.LastName,+" "+req.query.Email)



    if( req.query.hasOwnProperty("ACT_Button")){
        title=req.query.FirstName+", Are you ready? "

        res.render('Test_Options',{title, Test_Type:"ACT",FirstName:req.query.FirstName,LastName:req.query.LastName,Email:req.query.Email})
    }

    if( req.query.hasOwnProperty("Search_Student")){
        title= "Type in student last name"

        res.render('SearchStudent',{title, Test_Type:"ACT",FirstName:req.query.FirstName,LastName:req.query.LastName,Email:req.query.Email})
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