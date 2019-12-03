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
    console.log("inside get Dashboard TO Start the TEst "+req.query.Test+" "+req.query.Test_Type+" "+req.query.Time_Limit_Question+" "+req.query.Time_Limit_Test);

    if (req.query.Type_Holder=="Weakness"){

        var Database_Object=new Database(req.query.Test_Type,null,Current_Sessions.length,[req.query.checkbox_time,req.query.checkbox_1,req.query.checkbox_2]);
        Database_Object.setTimeLimit(req.query.Time_Limit_Question,req.query.Time_Limit_Test)
        var id=await Database_Object.getStudentID(req.query.FirstName,req.query.LastName,req.query.Email);//INitializes the Student Object here also
        //console.log("outside of getting student")
       if(await Database_Object.initializeWeakness_History()==0){
           title="       You do not have sufficient history of responses to create Weakness Stream ....please go back and answer some questions"
           res.render('register_Question_Weakness', {Question_Body_Holder:title, Answer_A:"Sample A",
               Answer_B:"SampleB",Answer_C:"Sample C",Passage_Holder:"No History",
                title: title,
               Database_Index:Current_Sessions.length,Time_Limit_Holder:Database_Object.Time_Limit
           })
           return;
       }
        await Database_Object.initializeWeakness_List();
        title="This is a Sample Question for the Weakness Module...."
        res.render('register_Question_Weakness', {Question_Body_Holder:title, Answer_A:"Sample A",
            Answer_B:"SampleB",Answer_C:"Sample C",Passage_Holder:Database_Object.DisplayWeaknessList(),

             Database_Index:Current_Sessions.length,Time_Limit_Holder:Database_Object.Time_Limit
        })
        Current_Sessions.push(Database_Object);
        return;

    }
    if (req.query.Type_Holder=="LoadTests"){
        console.log("inside loadtests")
        var Database_Object=new Database(req.query.Test_Type,req.query.Test,Current_Sessions.length,[req.query.checkbox_time,req.query.checkbox_1,req.query.checkbox_2]);
        //Database_Object.setTimeLimit(req.query.Time_Limit_Question,req.query.Time_Limit_Test)
        var test_list=await Database_Object.getTests();
        var tests=document.createElement('select')
        title="Are you ready? "+req.query.FirstName+", to take the ACT?"
        for(var i =0; i<test_list.length;++i){

            var option=document.createElement('option')
            option.value=test_list[i]
            option.text=test_list[i];
            tests.add(option)
        }
        res.render('Test_Options',{title, Test_Type_Holder:req.query.Test_Type,FirstName:req.query.FirstName,LastName:req.query.LastName,Email:req.query.Email,Test:tests})
        Current_Sessions.push(Database_Object);
        return;
    }

    console.log("inside get Dashboard TO Start the TEst"+req.query.Test+" "+req.query.checkbox_time)

    var Database_Object=new Database(req.query.Test_Type,req.query.Test,Current_Sessions.length,[req.query.checkbox_time,req.query.checkbox_1,req.query.checkbox_2]);//keeping record of the index in Current_Session

    Database_Object.setTimeLimit(req.query.Time_Limit_Question,req.query.Time_Limit_Test)

    var id=await Database_Object.getStudentID(req.query.FirstName,req.query.LastName,req.query.Email);//INitializes the Student Object here also

    await Database_Object.InitializeQuestions();


    title="This is a Sample Question"
    res.render('register_Question', {Question_Body_Holder:title, Answer_A:"Sample A",
        Answer_B:"SampleB",Answer_C:"Sample C",
        Passage_Holder:Database_Object.DisplayQuestionsList(),
        storyboxID:"STORY BOARD", Database_Index:Current_Sessions.length,Time_Limit_Holder:req.query.Time_Limit_Question,
        CheckBox_List:Database_Object.CheckBox_List
    })
    Current_Sessions.push(Database_Object);
})
router.get('/Weakness',async function(req, res, next){
    console.log("Inside weakness"+req.query.FirstName);
    //var Database_Object=new Database(null,null,Current_Sessions.length,[]);
    //
    //await Database_Object.initializeWeakness_List();


    title=req.query.FirstName+", "+"Are you ready to address your Weaknesses?"
    res.render('Test_Options', {title:title, FirstName:req.query.FirstName,LastName:req.query.LastName,Email:req.query.Email,
        Type_Holder:"Weakness"

    })

    //Current_Sessions.push(Database_Object)

})


router.get('/Question_Loop_Weakness',async function(req,res,next){
    console.log("Inside Question Loop weakness"+" "+req.query.Database_Index);

    var Database_Object=Current_Sessions[req.query.Database_Index]

    console.log("How many answered Questions?"+" "+req.query.normal_Question_Index)
    if (Database_Object.Count==0){

        ++Database_Object.Count;
        Question_object=Database_Object.Last_Question

        await Database_Object.initialize_Tag_history();//collect a history of already done Tagged qestions
        await Database_Object.initializeTagged_List();//erasing past ones
        Database_Object.orderTagged_List();//Usually means shuffling
    }
    else if(parseInt(req.query.normal_Question_Index)!=parseInt(Database_Object.Normal_Index) ){//He switched to a another question number from the buttons
        console.log("Inside get next question at an index")
        console.log("req.time "+req.query.time)

        await Database_Object.saveResponse(req.query.combo,req.query.time,req.query.First_Hint_holder,req.query.number_checks)
        await Database_Object.getNextWeakQuestion(parseInt(req.query.normal_Question_Index));
        Question_object=Database_Object.Last_Question
        await Database_Object.initialize_Tag_history();//collect a history of already done Tagged qestions
        await Database_Object.initializeTagged_List();//erasing past ones
        Database_Object.orderTagged_List();//Usually means shuffling

    }
    else if (req.query.hasOwnProperty("next_question")){
        ++Database_Object.Count;
        console.log("Inside next Weakness Question")
        await Database_Object.saveResponse(req.query.combo,req.query.time,req.query.First_Hint_holder,req.query.number_checks)
        await Database_Object.getNextWeakQuestion(parseInt(req.query.normal_Question_Index)+1);
        Question_object=Database_Object.Last_Question
        await Database_Object.initialize_Tag_history();//collect a history of already done Tagged qestions
        await Database_Object.initializeTagged_List();//erasing past ones
        Database_Object.orderTagged_List();//Usually means shuffling
    }
    else if(parseInt(req.query.tagged_Questions_holder)>=0){
        console.log("INside tagged question(weakness branch)"+" "+req.query.combo,req.query.First_Hint_holder,req.query.Right_Answer)
        await Database_Object.saveResponse(req.query.combo,req.query.time,req.query.First_Hint_holder,req.query.number_checks) //its important you always save response BEFORE getSameTag because it updates history in this function
        await Database_Object.getSame_TagQuestion(parseInt(req.query.tagged_Questions_holder));
        Question_object=Database_Object.Last_Tagged_Question //this means that database.LastQuestion remains the same as when you left the main branch (test taking branch)

    }


    title=Question_object.Question_text;

    var {JSDOM} = require("jsdom");
    var jsdom=require("jsdom")
    var data = fs.readFileSync('C:\\Users\\david\\Downloads\\Krupnick_Approach-dev\\views\\register_Question.hbs','utf-8');
    var document = new JSDOM(data).window.document;

    var element=document.createElement("textarea");
    //console.log("Passage Outside"+" "+Question_object.getPassage())
    element.value=Question_object.getPassage()
    //console.log("Choices eing rendered"+" "+Question_object.getOptions()[0]);
    //console.log("Choices eing rendered"+" "+Question_object.getOptions()[0].replace(/,/g,' '));
    res.render('register_Question_Weakness', {Question_Body_Holder:title, Passage_Holder:element.value, Answer_A:Question_object.getOptions()[0].replace(/,/g,' '),
        Answer_B:Question_object.getOptions()[1].replace(/,/g,' '),Answer_C:Question_object.getOptions()[2].replace(/,/g,' '),
        Answer_D: Question_object.getOptions()[3].replace(/,/g,' '), Answer_E:Question_object.getOptions()[4].replace(/,/g,' '),
        Database_Index: req.query.Database_Index, tagged_Questions_holder:Database_Object.DisplayTaggedList(),
        Right_Answer:Question_object.Right_Answer,normal_Question_Index:Database_Object.Normal_Index,Tag_Holder:Question_object.Tag,
        Question_Length:Database_Object.List_WeaknessQuestions.length,
        Test_Both: "Weakness Stream"+" "+Database_Object.Last_Question.Test_Type,
        First_Hint_holder:Question_object.First_Hint.join(" "),Time_Limit_Holder:Database_Object.Question_Time_Limit
})


    //Current_Sessions[req.query.Database_Index]=Question_object;

    console.log(JSON.stringify(req.body))

    ++counter;

})
router.get('/Question_Loop',async function (req, res, next) {
    console.log("Inside Question_Loop!!!!!!")
    var {JSDOM} = require("jsdom");
    var jsdom=require("jsdom")
    var data = fs.readFileSync('C:\\Users\\david\\Downloads\\Krupnick_Approach-dev\\views\\register_Question.hbs','utf-8');
    var document = new JSDOM(data).window.document;


    var Database_Object=Current_Sessions[req.query.Database_Index]

    console.log("Index being requested"+" "+req.query.normal_Question_Index+" "+req.query.Exit_bool)
    //console.log("argument passed"+" "+req.query.tagged_Questions_holder);//brings back the index for the tagged question
    if (Database_Object.Count==0){

        ++Database_Object.Count;
        Database_Object.startTime();//Only keeps track of total time.
        Question_object=Database_Object.Last_Question
        Database_Object.Normal_Index=0;
        await Database_Object.initialize_Tag_history();//collect a history of already done Tagged qestions
        await Database_Object.initializeTagged_List();//erasing past ones
        Database_Object.orderTagged_List();//Usually means shuffling
    }
    else if(req.query.Exit_bool=="true"){
        console.log("Entering Exit")
        console.log("Length before"+Current_Sessions.length)
        Current_Sessions.splice(req.query.Database_Index,1)
        console.log("Length after+Current_Sessions.length"+Current_Sessions.length)
        res.render('dashboard', {title,FirstName:Database_Object.Student.firstName,LastName:Database_Object.Student.lastName, Email:Database_Object.Student.email })

        return
    }
    else if(parseInt(req.query.Final_Questions_holder)>=0){
        console.log("INside Final Review question "+Question_object.Response)

        await Database_Object.getNextQuestion(parseInt(req.query.Final_Questions_holder)-1);
        Question_object=Database_Object.Last_Question //this means that database.LastQuestion remains the same as when you left the main branch (test taking branch)

        var element=document.createElement("textarea");
        //console.log("Passage Outside"+" "+Question_object.getPassage())
        element.value=Question_object.getPassage()
        title=Question_object.Number+".)"+" "+Question_object.Question_text;
        res.render('register_Question', {Question_Body_Holder:title, Passage_Holder:element.value, Answer_A:Question_object.getOptions()[0],
            Answer_B:Question_object.getOptions()[1],Answer_C:Question_object.getOptions()[2],
            Answer_D: Question_object.getOptions()[3], Answer_E:Question_object.getOptions()[4],
            Database_Index: req.query.Database_Index, tagged_Questions_holder:Database_Object.DisplayTaggedList(),
            Right_Answer:Question_object.Right_Answer,normal_Question_Index:req.query.Final_Questions_holder,Tag_Holder:Question_object.Tag,
            Test_Both:Database_Object.Last_Question.Test+" "+Database_Object.Last_Question.Test_Type,
            First_Hint_holder:Question_object.First_Hint.join(" "),Final_Questions_holder: await Database_Object.DisplayResultList(),Time_Limit_Holder:Question_object.Response,
            Question_Length:Database_Object.List_Questions.length,Presentation_Holder:Question_object.Presentation_Highlight.join(" ")
        })
        return;
    }
    else if(parseInt(req.query.normal_Question_Index)!=parseInt(Database_Object.Last_Question.Number)-1 ){//He switched to a another question number from the buttons
        console.log("Inside get next question at an index")
        console.log("req.time "+req.query.time+" "+req.query.First_Hint_holder+" "+req.query.number_checks)

        await Database_Object.saveResponse(req.query.combo,req.query.time,req.query.First_Hint_holder,req.query.number_checks)
        var end=await Database_Object.getNextQuestion(parseInt(req.query.normal_Question_Index));
        if(end==false){
            title="You have reached the end, congratulations. Please review your answers below"
            res.render('Ending', {Question_Body_Holder:title,
                Database_Index: req.query.Database_Index,
                Final_Questions_holder:Database_Object.DisplayResultList(),
                normal_Question_Index:req.query.normal_Question_Index

            })
        };
        Question_object=Database_Object.Last_Question
        await Database_Object.initialize_Tag_history();//collect a history of already done Tagged qestions
        await Database_Object.initializeTagged_List();//erasing past ones
        Database_Object.orderTagged_List();//Usually means shuffling

    }
    else if (req.query.hasOwnProperty("next_question")){
        console.log("Inside next Question")
        console.log("req.time "+req.query.time+" "+req.query.First_Hint_holder+" "+req.query.number_checks)
        await Database_Object.saveResponse(req.query.combo,req.query.time,req.query.First_Hint_holder,req.query.number_checks)
        var end=await Database_Object.getNextQuestion(parseInt(req.query.normal_Question_Index)+1);
        if(end==false){
            title="You have reached the end, congratulations. Please review your answers below"
            res.render('Ending', {Question_Body_Holder:title,
                Database_Index: req.query.Database_Index,
                Final_Questions_holder: await Database_Object.DisplayResultList(),
                normal_Question_Index:req.query.normal_Question_Index,Time_Limit_Holder:Database_Object.Question_Time_Limit
            })
            return;
        };
        Question_object=Database_Object.Last_Question
        await Database_Object.initialize_Tag_history();//collect a history of already done Tagged qestions
        await Database_Object.initializeTagged_List();//erasing past ones
        Database_Object.orderTagged_List();//Usually means shuffling
    }
    else if(parseInt(req.query.tagged_Questions_holder)>=0){
        console.log("INside tagged question"+" "+req.query.combo)
        console.log("req.time "+req.query.time+" "+req.query.First_Hint_holder+" "+req.query.number_checks)
        await Database_Object.saveResponse(req.query.combo,req.query.time,req.query.First_Hint_holder,req.query.number_checks) //its important you always save response BEFORE getSameTag because it updates history in this function
        await Database_Object.getSame_TagQuestion(parseInt(req.query.tagged_Questions_holder));
        Question_object=Database_Object.Last_Tagged_Question //this means that database.LastQuestion remains the same as when you left the main branch (test taking branch)

    }




    title=Question_object.Number+".)"+" "+Question_object.Question_text;


    var {JSDOM} = require("jsdom");
    var jsdom=require("jsdom")
    var data = fs.readFileSync('C:\\Users\\david\\Downloads\\Krupnick_Approach-dev\\views\\register_Question.hbs','utf-8');
    var document = new JSDOM(data).window.document;

    var element=document.createElement("textarea");
    //console.log("Passage Outside"+" "+Question_object.getPassage())
    element.value=Question_object.getPassage()


    res.render('register_Question', {Question_Body_Holder:title, Question_Number: Question_object.Number, Passage_Holder:element.value, Answer_A:Question_object.getOptions()[0],
        Answer_B:Question_object.getOptions()[1],Answer_C:Question_object.getOptions()[2],
        Answer_D: Question_object.getOptions()[3], Answer_E:Question_object.getOptions()[4],
        Database_Index: req.query.Database_Index, tagged_Questions_holder:Database_Object.DisplayTaggedList(),
        Right_Answer:Question_object.Right_Answer,normal_Question_Index:Database_Object.Normal_Index,Tag_Holder:Question_object.Tag,
        Test_Both:Database_Object.Last_Question.Test+" "+Database_Object.Last_Question.Test_Type,
        First_Hint_holder:Question_object.First_Hint.join(" "),Final_Questions_holder:[],Time_Limit_Holder:Database_Object.Question_Time_Limit,
        Total_Time:Database_Object.getTest_Time_Current(),Question_Length:Database_Object.List_Questions.length,
        CheckBox_List:Database_Object.CheckBox_List,Presentation_Holder:Question_object.Presentation_Highlight.join(" ")
    })

    if (counter!=0){
        Question_object.recordResponse(req.body.combo,timer)
        Responses.push(Question_object);
        //Database_Object.recordSession(Question_object,Student_Object);
    }
    //Current_Sessions[req.query.Database_Index]=Question_object;

    console.log(JSON.stringify(req.body))

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
