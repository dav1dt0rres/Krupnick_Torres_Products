const express = require('express')
const Question = require('../Models/Question.js');
var Database=require('../Models/Database.js');
const Student = require('../Models/Student.js');


const router = express.Router()
var counter=0;
var timer;

var descriptionList=[];
var Responses=[];
var mySet;
var Database_Object=null;
var Question_object=null;
var Student_Object;
var title;
var counter=0;

router.get('/', function (req, res, next) {

    console.log("inside get Dashboard TO Start the TEst"+req.query.Time_Limit,req.query.Test_Type,req.query.Test)

    Database_Object=new Database(req.query.Test_Type,req.query.Test);
    var id=Database_Object.getStudentID(req.query.firstName,req.query.lastName,req.query.email);
    Student_Object=new Student(req.query.FirstName,req.query.lastName,req.query.email,id);
    Database_Object.InitializeQuestions();
    title="This is a Sample Question"
    res.render('register_Question', {title, Answer_A:"Sample A",
        Answer_B:"SampleB",Answer_C:"Sample C",

        storyboxID:"STORY BOARD"
    })

})
router.get('/Question_Loop',function (req, res, next) {
    console.log("Inside Question_Loop!!!!!!")

    if (counter!=0){////Maintains the clock
        clearInterval(mySet);
    }
    var duration=1*60
    Question_object=Database_Object.getQuestion()

    title=Question_object.Question_text;
    console.log("The passage"+" "+Question_object.getPassage())
    res.render('register_Question', {title, Answer_A:Question_object.getOptions()[0],
        Answer_B:Question_object.getOptions()[1],Answer_C:Question_object.getOptions()[2],
        Answer_D: Question_object.getOptions()[3], Answer_E:Question_object.getOptions()[4],
        storyboxID:Question_object.getPassage()
    })


    if (counter!=0){
        Question_object.recordResponse(req.body.combo,timer)
        Responses.push(Question_object);
        //Database_Object.recordSession(Question_object,Student_Object);
    }


    console.log(JSON.stringify(req.body))
    startTimer(duration)
    ++counter;
})



router.get('/SAT',function (req, res, next) {
    console.log("inside SAT!!!!!!")

    res.redirect('/AddQuestions')

})

router.get('/Razvan',function (req, res, next){
    console.log("Inside Dashboard function Razvan")
    res.redirect(307,'/ModelPredictor');

})
router.get('/Skill',function (req, res, next) {
    console.log("inside SkillBuilders!!!!!!")

    res.redirect('/AddQuestions')

})

router.post('/', function (req, res, next) {
    console.log("inside get Dashboard!!!!!!"+req.body.firstName)
    res.render('dashboard', {title,FirstName:req.body.firstName,LastName:req.body.lastName, Email: req.body.email})



})



function SimilarMethod(){
  var duration=1*60
  Question_object=Database_Object.getSame_MethodQuestion(Responses[Responses.length-1]);

  title=Database_Object.getQuestion().Question_text;
  res.render('register_Question', {title, Answer_A:Question_object.getOptions()[0],Answer_B:Question_object.getOptions()[1],Answer_C:Question_object.getOptions()[2]})

}

function startTimer(duration) {
  var minutes, seconds;
  timer = duration;
  mySet=setInterval(function () {
    minutes = parseInt(timer / 60, 10)
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;



    if (--timer < 0) {
      timer = duration;

    }
  }, 1000);

}

module.exports = router
