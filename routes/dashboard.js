const express = require('express')
const Question = require('../Objects/Question.js');
var Database=require('../Objects/Database.js');
const Student = require('../Objects/Student.js');
var fs              = require('fs')
var {JSDOM} = require("jsdom");
var jsdom=require("jsdom")
var data = fs.readFileSync('C:\\Users\\david\\Downloads\\Krupnick_Approach-dev\\views\\register_Question.hbs','utf-8');
var document = new JSDOM(data).window.document;
const router = express.Router()
var counter=0;
var timer;

var descriptionList=[];
var Responses=[];
var mySet;

var Question_object=null;
var Student_Object;
var title;
var counter=0;
var Current_Sessions=[]; //MAINTAINS THE ENTIRE LIST OF THREADS OF STUDENTS, THIS IS AN ARRAY OF TYPE DATABASE.JS

router.get('/', async function (req, res, next) {

    console.log("inside get Dashboard TO Start the TEst"+req.query.Time_Limit,req.query.Test_Type,req.query.Test)

   var Database_Object=new Database(req.query.Test_Type,req.query.Test,Current_Sessions.length);//keeping record of the index in Current_Session


    var id=Database_Object.getStudentID(req.query.firstName,req.query.lastName,req.query.email);
    console.log("id coming out"+" "+id)
    Student_Object=new Student(req.query.FirstName,req.query.lastName,req.query.email,id);
    Database_Object.setStudent(Student_Object)
    await Database_Object.InitializeQuestions();


    title="This is a Sample Question"
    res.render('register_Question', {title, Answer_A:"Sample A",
        Answer_B:"SampleB",Answer_C:"Sample C",

        storyboxID:"STORY BOARD", Database_Index:Current_Sessions.length
    })
    Current_Sessions.push(Database_Object);
})
router.get('/Question_Loop',async function (req, res, next) {
    console.log("Inside Question_Loop!!!!!!")

    if (counter!=0){////Maintains the clock
        clearInterval(mySet);
    }
    var duration=1*60
    console.log("current sessions length"+" "+Current_Sessions.length+" "+req.query.Database_Index)

    var Database_Object=Current_Sessions[req.query.Database_Index]
    await Database_Object.saveNewResponse(req.query.combo)

    if(req.query.hasOwnProperty("next_question")){
        await Database_Object.getNextQuestion();
        Question_object=Database_Object.Last_Question
        Database_Object.initializeTagged_List();//erasing past ones
        Database_Object.orderTagged_List();//Usually means shuffling
        //Question_object=Database_Object.getNextQuestions(); //this is to display a list on the front-end
    }
    else if(req.query.hasOwnProperty("tag_question")){
        await Database_Object.getSame_TagQuestion();
        Question_object=Database_Object.Last_Question
        //Question_object=Database_Object.getTaggedQuestions()//this is to display a list on the front-end
    }
    else if(req.query.hasOwnProperty("Exit")){
        console.log("Entering Exit")
        console.log("Length before"+Current_Sessions.length)
      Current_Sessions.splice(req.query.Database_Index,1)
        console.log("Length after+Current_Sessions.length"+Current_Sessions.length)
    }


    title=Question_object.Number+".)"+" "+Question_object.Question_text;

    var {JSDOM} = require("jsdom");
    var jsdom=require("jsdom")
    var data = fs.readFileSync('C:\\Users\\david\\Downloads\\Krupnick_Approach-dev\\views\\register_Question.hbs','utf-8');
    var document = new JSDOM(data).window.document;

    var element=document.createElement("textarea");
    //console.log("Passage Outside"+" "+Question_object.getPassage())
    element.value=Question_object.getPassage()


    res.render('register_Question', {title,Passage_Holder:element.value, Answer_A:Question_object.getOptions()[0],
        Answer_B:Question_object.getOptions()[1],Answer_C:Question_object.getOptions()[2],
        Answer_D: Question_object.getOptions()[3], Answer_E:Question_object.getOptions()[4],
         Database_Index: req.query.Database_Index
    })

    if (counter!=0){
        Question_object.recordResponse(req.body.combo,timer)
        Responses.push(Question_object);
        //Database_Object.recordSession(Question_object,Student_Object);
    }
    Current_Sessions[req.query.Database_Index]=Question_object;

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
