const express = require('express')
var mongoose = require('mongoose');
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
var Student_table=mongoose.model('Student')
var descriptionList=[];
var Responses=[];
var mySet;

var Question_object=null;
var Student_Object;
var title;
var counter=0;
var Current_Sessions=[]; //MAINTAINS THE ENTIRE LIST OF THREADS OF STUDENTS, THIS IS AN ARRAY OF TYPE DATABASE.JS

router.get('/', async function (req, res, next) {

    console.log("inside get Dashboard TO Start the TEst"+req.query.Time_Limit,req.query.Test_Type,req.query.Test,req.query.Email+" "+req.query.checkbox_1+" "+req.query.checkbox_2+" "+req.query.checkbox_3)

    var Database_Object=new Database(req.query.Test_Type,req.query.Test,Current_Sessions.length,[req.query.checkbox_1,req.query.checkbox_2,req.query.checkbox_3]);//keeping record of the index in Current_Session


    var id=await Database_Object.getStudentID(req.query.FirstName,req.query.LastName,req.query.Email);//INitializes the Student Object here also

    await Database_Object.InitializeQuestions();


    title="This is a Sample Question"
    res.render('register_Question', {Question_Body_Holder:title, Answer_A:"Sample A",
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
    //console.log("current sessions length"+" "+Current_Sessions.length+" "+req.query.Database_Index)

    var Database_Object=Current_Sessions[req.query.Database_Index]

    console.log("How many answered Questions?"+" "+Database_Object.Count)
    //console.log("argument passed"+" "+req.query.tagged_Questions_holder);//brings back the index for the tagged question
    if (Database_Object.Count==0){

        ++Database_Object.Count;
        Question_object=Database_Object.Last_Question

        await Database_Object.initialize_Tag_history();//collect a history of already done Tagged qestions
        await Database_Object.initializeTagged_List();//erasing past ones
        Database_Object.orderTagged_List();//Usually means shuffling
    }

    else if(parseInt(req.query.normal_Question_Index)!=parseInt(Database_Object.Last_Question.Number) ){
        console.log("Inside get next question at an index")
        console.log("req.time "+req.query.time)

        await Database_Object.saveResponse(req.query.combo,req.query.time)
        await Database_Object.getNextQuestion(parseInt(req.query.normal_Question_Index));
        Question_object=Database_Object.Last_Question
        await Database_Object.initialize_Tag_history();//collect a history of already done Tagged qestions
        await Database_Object.initializeTagged_List();//erasing past ones
        Database_Object.orderTagged_List();//Usually means shuffling

    }
    else if (req.query.hasOwnProperty("next_question")){
        console.log("Inside next Question")
        await Database_Object.saveResponse(req.query.combo,req.query.time)
        await Database_Object.getNextQuestion(parseInt(req.query.normal_Question_Index)+1);
        Question_object=Database_Object.Last_Question
        await Database_Object.initialize_Tag_history();//collect a history of already done Tagged qestions
        await Database_Object.initializeTagged_List();//erasing past ones
        Database_Object.orderTagged_List();//Usually means shuffling
    }
    else if(parseInt(req.query.tagged_Questions_holder)>=0){
        console.log("INside tagged question"+" "+req.query.combo)
        await Database_Object.saveResponse(req.query.combo,req.query.time) //its important you always save response BEFORE getSameTag because it updates history in this function
        await Database_Object.getSame_TagQuestion(parseInt(req.query.tagged_Questions_holder));
        Question_object=Database_Object.Last_Question

    }
    else if(req.query.hasOwnProperty("Exit")){
        console.log("Entering Exit")
        console.log("Length before"+Current_Sessions.length)
      Current_Sessions.splice(req.query.Database_Index,1)
        console.log("Length after+Current_Sessions.length"+Current_Sessions.length)
        return
    }


    title=Question_object.Number+".)"+" "+Question_object.Question_text;




    var {JSDOM} = require("jsdom");
    var jsdom=require("jsdom")
    var data = fs.readFileSync('C:\\Users\\david\\Downloads\\Krupnick_Approach-dev\\views\\register_Question.hbs','utf-8');
    var document = new JSDOM(data).window.document;

    var element=document.createElement("textarea");
    //console.log("Passage Outside"+" "+Question_object.getPassage())
    element.value=Question_object.getPassage()


    res.render('register_Question', {Question_Body_Holder:title, Passage_Holder:element.value, Answer_A:Question_object.getOptions()[0],
        Answer_B:Question_object.getOptions()[1],Answer_C:Question_object.getOptions()[2],
        Answer_D: Question_object.getOptions()[3], Answer_E:Question_object.getOptions()[4],
         Database_Index: req.query.Database_Index, tagged_Questions_holder:Database_Object.DisplayTaggedList(),
        Right_Answer:Question_object.Right_Answer,normal_Question_Index:Question_object.Number,Tag_Holder:Question_object.Tag
    })

    if (counter!=0){
        Question_object.recordResponse(req.body.combo,timer)
        Responses.push(Question_object);
        //Database_Object.recordSession(Question_object,Student_Object);
    }
    //Current_Sessions[req.query.Database_Index]=Question_object;

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

router.post('/', async function (req, res, next) {
    console.log("inside get Dashboard!!!!!!"+req.body.firstName)
    if(req.body.hasOwnProperty("new_student")){

        var Student_ID;
        var newStudent = new Student_table({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
        });
        await newStudent.save(function(err,object){
            if (err) {
                console.log("Error caough"+err.toString())
            }

            Student_ID=object.id;
        });
        console.log("New Student ID "+Student_ID)

    }

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
