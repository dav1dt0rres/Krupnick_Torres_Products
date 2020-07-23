const express = require('express')
var mongoose = require('mongoose');
const Question = require('../Objects/Question.js');
var Database=require('../Objects/Database.js');
var MYSQLInstance=require('../Objects/MYSQLInstance.js');
const Student = require('../Objects/Student.js');
var fs              = require('fs')
var {JSDOM} = require("jsdom");
var jsdom=require("jsdom")
var data = fs.readFileSync('./views/register_Question.hbs','utf-8');
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
var CurrentSQLInstances=[]
router.get('/', async function (req, res, next) {


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
    else if (req.query.Type_Holder=="LoadTests"){//When student is about to take a test and he first choooces teh test type
        console.log("inside loadtests")
        var Database_Object=new Database(req.query.Test_Type,"not null",Current_Sessions.length,[req.query.checkbox_time,req.query.checkbox_1,req.query.checkbox_2]);
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
        var option=document.createElement('option')
        option.value='Set'
        option.text="Set of Questions (Practice Mode)"
        tests.add(option)

        res.render('Test_Options',{title, Test_Type_Holder:req.query.Test_Type,FirstName:req.query.FirstName,LastName:req.query.LastName,Email:req.query.Email,Test:tests})
        //Current_Sessions.push(Database_Object);
        return;
    }
    else if(req.query.Type_Holder=="Load_Sub_Tags"){
        console.log("inside loadSemiTags "+req.query.Tag_List)
        var Database_Object=new Database(req.query.Test_Type,"not null",Current_Sessions.length,[req.query.checkbox_time,req.query.checkbox_1,req.query.checkbox_2]);
        if(req.query.Test_Type=="ACT-Math"){
            console.log("Loading Math Results "+req.query.Math_Search)
            var test_list=await Database_Object.getTests();

            var tests=document.createElement('select')
            for(var i =0; i<test_list.length;++i){

                var option=document.createElement('option')
                option.value=test_list[i]
                option.text=test_list[i];
                tests.add(option)
            }
            var option=document.createElement('option')
            option.value='Set'
            option.text="Set of Questions (Practice Mode)"
            tests.add(option)



            var Semi_Tags=await Database_Object.getSemiTags(req.query.Math_Search);
            var semi_tags=document.createElement('select');
            var option=document.createElement('option')
            option.value="Please Choose One"
            option.text="Please Choose One";
            semi_tags.add(option)
            for(var i =0; i<Semi_Tags.length;++i){

                var option=document.createElement('option')
                option.value=Semi_Tags[i]
                option.text=Semi_Tags[i];

                semi_tags.add(option)
            }
            res.render('Test_Options',{title,Math_Search:req.query.Math_Search,Semi_Tags:semi_tags, Load_Math_Search:"results",Test_Type_Holder:req.query.Test_Type,FirstName:req.query.FirstName,LastName:req.query.LastName,Email:req.query.Email,Test:tests})
            return;
        }
        //Database_Object.setTimeLimit(req.query.Time_Limit_Question,req.query.Time_Limit_Test)
        var test_list=await Database_Object.getTests();
        var tag_list=await Database_Object.getTags();
        var Semi_Tags=await Database_Object.getSemiTags(req.query.Tag_List);
        var tests=document.createElement('select')
        title="Are you ready? "+req.query.FirstName+", to take the ACT?"
        for(var i =0; i<test_list.length;++i){

            var option=document.createElement('option')
            option.value=test_list[i]
            option.text=test_list[i];
            tests.add(option)
        }
        var option=document.createElement('option')
        option.value='Set'
        option.text="Set of Questions (Practice Mode)"
        tests.add(option)


        var tags=document.createElement('select')
        for(var i =0; i<tag_list.length;++i){

            var option=document.createElement('option')
            option.value=tag_list[i]
            option.text=tag_list[i];

            tags.add(option)
        }

        var semi_tags=document.createElement('select');
        var option=document.createElement('option')
        option.value="Please Choose One"
        option.text="Please Choose One";
        semi_tags.add(option)
        for(var i =0; i<Semi_Tags.length;++i){

            var option=document.createElement('option')
            option.value=Semi_Tags[i]
            option.text=Semi_Tags[i];

            semi_tags.add(option)
        }

        res.render('Test_Options',{title,Semi_Tags:semi_tags,Tag_Holder:req.query.Tag_List, Load_Tags:"true",Test_Type_Holder:req.query.Test_Type,FirstName:req.query.FirstName,LastName:req.query.LastName,Email:req.query.Email,Test:tests,Tag_List:tags})
        //Current_Sessions.push(Database_Object);
        return;

    }
    else if(req.query.Type_Holder=="LoadTags"){//
        console.log("inside loadTags")
        var Database_Object=new Database(req.query.Test_Type,"not null",Current_Sessions.length,[req.query.checkbox_time,req.query.checkbox_1,req.query.checkbox_2]);
        //Database_Object.setTimeLimit(req.query.Time_Limit_Question,req.query.Time_Limit_Test)
        var test_list=await Database_Object.getTests();
        var tag_list=await Database_Object.getTags();


        var tests=document.createElement('select')
        title="Are you ready? "+req.query.FirstName+", to take the ACT?"
        for(var i =0; i<test_list.length;++i){

            var option=document.createElement('option')
            option.value=test_list[i]
            option.text=test_list[i];
            tests.add(option)
        }
        var option=document.createElement('option')
        option.value='Set'
        option.text="Set of Questions (Practice Mode)"
        tests.add(option)
        if (req.query.Test_Type=="ACT-Math"){
            console.log("Rendering the Math Interface")
            res.render('Test_Options',{title,Load_Math_Search:"true",Test_Type_Holder:req.query.Test_Type,FirstName:req.query.FirstName,LastName:req.query.LastName,Email:req.query.Email,Test:tests});
            return;
        }

        var tags=document.createElement('select');
        var option=document.createElement('option')
        option.value=""
        option.text="Please Select Tag";

        tags.add(option)
        for(var i =0; i<tag_list.length;++i){

            var option=document.createElement('option')
            option.value=tag_list[i]
            option.text=tag_list[i];

            tags.add(option)
        }
        var semi_tags=document.createElement('select');
        var option=document.createElement('option')
        option.value="Please Choose One"
        option.text="Please Choose One";
        semi_tags.add(option)
        res.render('Test_Options',{title, Semi_Tags:semi_tags,Load_Tags:"true",Test_Type_Holder:req.query.Test_Type,FirstName:req.query.FirstName,LastName:req.query.LastName,Email:req.query.Email,Test:tests,Tag_List:tags})
        //Current_Sessions.push(Database_Object);
        return;
    }
    console.log("inside get Dashboard TO Start the TEst"+req.query.Test+" "+req.query.Math_Search+" CONTINUED "+req.query.BookMark+" "+req.query.Session)

    var Database_Object=new Database(req.query.Test_Type,req.query.Test,Current_Sessions.length,[req.query.checkbox_time,req.query.checkbox_1,req.query.checkbox_2]);//keeping record of the index in Current_Session
    Database_Object.Math_Tag_Sets=req.query.Math_Search///FOr math specifically it doenst have a "Tag_List" element from html;\
    Database_Object.Tag=req.query.Semi_Tags;
    console.log("established Tag math "+Database_Object.Tag)
    Database_Object.setTimeLimit(req.query.Time_Limit_Question,req.query.Time_Limit_Test)

    var id=await Database_Object.getStudentID(req.query.FirstName,req.query.LastName,req.query.Email);//INitializes the Student Object here also;
    if(req.query.BookMark){
        console.log('THIS IS CONTINUED SO SUBTRACTING A SESSION')
        await Database_Object.subtractSession(req.query.FirstName,req.query.LastName,req.query.Email,req.query.Session)//basically because hes continuing last session so subtract the one that exists in mongoose.
    }
    Database_Object.send_email("started")
    await Database_Object.InitializeQuestions(req.query.Session,req.query.BookMark,req.query.Tag_List,req.query.Semi_Tags,req.query.Number_Questions,req.query.checkbox_historical);


    title="This is a Sample Question, please press Submit(Next Question)"
    if(Database_Object.Test_Type=="ACT-Math"){

        res.render('register_Question_Math', {Question_Body_Holder:title, Answer_A:"Sample A",
            Answer_B:"SampleB",Answer_C:"Sample C",
            Passage_Display_Holder:Database_Object.DisplayQuestionsList(),
            Total_Time_Holder:Database_Object.Test_Time_Limit+":00",
            storyboxID:"STORY BOARD", Database_Index:Current_Sessions.length,Time_Limit_Holder:req.query.Time_Limit_Question,
            CheckBox_List:Database_Object.CheckBox_List
        })
    }
    else if(Database_Object.Test_Type=="ACT-Science"){
        res.render('register_Question_Science', {Question_Body_Holder:title, Answer_A:"Sample A",
            Answer_B:"SampleB",Answer_C:"Sample C",
            Total_Time_Holder:Database_Object.Test_Time_Limit+":00",
            Passage_Display_Holder:Database_Object.DisplayQuestionsList(),
            storyboxID:"STORY BOARD", Database_Index:Current_Sessions.length,Time_Limit_Holder:req.query.Time_Limit_Question,
            CheckBox_List:Database_Object.CheckBox_List
        })
    }
    else{
        res.render('register_Question', {Question_Body_Holder:title, Answer_A:"Sample A",
            Answer_B:"SampleB",Answer_C:"Sample C",
            Total_Time_Holder:Database_Object.Test_Time_Limit+":00",
            Passage_Holder:Database_Object.DisplayQuestionsList(),
            Total_Time:Database_Object.Test_Time_Limit,
            storyboxID:"STORY BOARD", Database_Index:Current_Sessions.length,Time_Limit_Holder:req.query.Time_Limit_Question,
            CheckBox_List:Database_Object.CheckBox_List
        })
    }

    Current_Sessions.push(Database_Object);
})



router.post('/Question_Loop_1',async function(req,res,next) {
    //console.log("Database index for hover histroy "+req.body.Database_Index)
    //console.log("REq query Database Hover_History" + req.body.Hover_history);
    console.log("Inside questionloop_1");
    var Database_Object=Current_Sessions[req.body.Database_Index];

    Database_Object.saveDrawHistory(req.body.Draw_Object);
    Database_Object.saveHoverHistory(req.body.Hover_history);
    return;
})
router.get('/Question_Loop',async function (req, res, next) {
    console.log("Inside Question_Loop!!!!!!")
    var {JSDOM} = require("jsdom");
    var jsdom=require("jsdom")
    var data = fs.readFileSync('./views/register_Question.hbs','utf-8');
    var document = new JSDOM(data).window.document;


    var Database_Object=Current_Sessions[req.query.Database_Index]

    console.log("Index being requested"+" "+req.query.normal_Question_Index+" "+Database_Object.Test)
    //console.log("argument passed"+" "+req.query.tagged_Questions_holder);//brings back the index for the tagged question
    if (Database_Object.Count==0){
        console.log("Count =0 ")
        ++Database_Object.Count;
        Database_Object.startTime();//Only keeps track of total time.
        Question_object=Database_Object.Last_Question

        //await Database_Object.initialize_Tag_history();//collect a history of already done Tagged qestions
        //await Database_Object.initializeTagged_List();//erasing past ones
        //Database_Object.orderTagged_List();//Usually means shuffling
    }
    else if(req.query.Exit_bool=="true"){
        console.log("Entering Exit")
        console.log("Length before"+Current_Sessions.length)
        Database_Object.SetContinuedEmail(req)
        //Current_Sessions.splice(req.query.Database_Index,1)

        title="Welcome to your Dashboard, "+Database_Object.Student.firstName;
        console.log("Length after+Current_Sessions.length"+Current_Sessions.length)
        res.render('dashboard', {title,FirstName:Database_Object.Student.firstName,LastName:Database_Object.Student.lastName, Email:Database_Object.Student.email })

        return
    }
    else if(parseInt(req.query.Final_Questions_holder.split(" ")[0])>=0){//the question is begin rendered for review purposes
        console.log("INside Final Review question "+req.query.Final_Questions_holder.split(" ")[0]+" "+req.query.Final_Questions_holder.split(" ")[1])

        await Database_Object.getNextQuestion_Final_Review(req.query.Final_Questions_holder);
        Question_object=Database_Object.Last_Question //this means that database.LastQuestion remains the same as when you left the main branch (test taking branch);

        var scaled=readScaledScore(Database_Object)
        var element=document.createElement("textarea");
        //console.log("Passage Outside"+" "+Question_object.getPassage())
        element.value=Question_object.getPassage()
        title=Question_object.Number+".)"+" "+Question_object.Question_text;
        res.render('register_Question', {Question_Body_Holder:title, Passage_Holder:element.value, Answer_A:Question_object.getOptions()[0],
            Answer_B:Question_object.getOptions()[1],Answer_C:Question_object.getOptions()[2],
            Answer_D: Question_object.getOptions()[3], Answer_E:Question_object.getOptions()[4],
            Database_Index: req.query.Database_Index,Final_Questions_holder:await Database_Object.DisplayResultList(scaled),
            Right_Answer:Question_object.Right_Answer,normal_Question_Index:req.query.Final_Questions_holder.split(" ")[0],Tag_Holder:Question_object.Tag,
            Test_Both:Database_Object.Last_Question.Test+" "+Database_Object.Last_Question.Test_Type,
            First_Hint_holder:Question_object.First_Hint.join(" "),Time_Limit_Holder:Question_object.Response,
            draw_history:Database_Object.getNormalLast_Question(req.query.Final_Questions_holder).getDrawHistory().join(" "),
            Question_Length:Database_Object.List_Questions.length,Presentation_Holder:Question_object.Presentation_Highlight.join(" ")
        })
        return;
    }
    else if(parseInt(req.query.normal_Question_Index)!=parseInt(Database_Object.Last_Question.Number)-1 ){//He switched to a another question number from the buttons
        console.log((parseInt(req.query.normal_Question_Index)+1) +"vs"+ Database_Object.Last_Question.Number)
        console.log("Inside get next question at an index (buttons)")
        console.log("req.time "+req.query.time+" "+req.query.First_Hint_holder+" "+req.query.number_checks)
        Database_Object.setTest_Time_Current(req.query.Total_Time_Holder)
        await Database_Object.saveResponse(req.query.combo,req.query.confidence,req.query.time,req.query.First_Hint_holder,req.query.number_checks,req.query.Combo_Holder,req.query.hover_history,req.query.Eliminated_Answers,req.query.Presentation_Holder)//Presenetation holder is only place holder for check answers
        var end=await Database_Object.getNextQuestion(parseInt(req.query.normal_Question_Index));
        if(end==false){
            var scaled=readScaledScore(Database_Object)
            title="You have reached the end, congratulations. Please review your answers below           Scaled Score: "+scaled
            res.render('Ending', {title:title,
                Database_Index: req.query.Database_Index,scaled_score:scaled,
                Final_Questions_holder:await Database_Object.DisplayResultList(scaled),//the reasonw e pass the argument is to see if this is a regular test or a Problem set
                normal_Question_Index:req.query.normal_Question_Index,Total_Time:Database_Object.getTest_Time_Current()

            })
            Database_Object.send_email("finished,"+Database_Object.Student.Session)
            return;
        };
        Question_object=Database_Object.Last_Question
        //await Database_Object.initialize_Tag_history();//collect a history of already done Tagged qestions
        //await Database_Object.initializeTagged_List();//erasing past ones
        //Database_Object.orderTagged_List();//Usually means shuffling

    }
    else if(Database_Object.Test.includes("Set") ){///This is for problem sets
        console.log("Inside get next question at an index (Problem_Sets)")
        console.log("req.time "+req.query.time+" "+req.query.First_Hint_holder+" "+req.query.number_checks)
        Database_Object.setTest_Time_Current(req.query.Total_Time_Holder)
        await Database_Object.saveResponse(req.query.combo,req.query.confidence,req.query.time,req.query.First_Hint_holder,req.query.number_checks,req.query.Combo_Holder,req.query.hover_history,req.query.Eliminated_Answers,req.query.Presentation_Holder)//Presenetation holder is only place holder for check answers
        var end=await Database_Object.getNextQuestion(parseInt(req.query.normal_Question_Index));
        if(end==false){
            var scaled=readScaledScore(Database_Object)
            title="You have reached the end, congratulations. Please review your answers below           Scaled Score: "+scaled
            res.render('Ending', {title:title,
                Database_Index: req.query.Database_Index,scaled_score:scaled,
                Final_Questions_holder:await Database_Object.DisplayResultList(scaled),
                normal_Question_Index:req.query.normal_Question_Index,Total_Time:Database_Object.getTest_Time_Current()

            })
            Database_Object.send_email("finished,"+Database_Object.Student.Session)
            return;
        };
        Question_object=Database_Object.Last_Question
    }
    else if (req.query.hasOwnProperty("next_question")){//pressed the right arrow or left
        console.log("Inside next Question")
        console.log("req.time "+req.query.time+" "+req.query.First_Hint_holder+" "+req.query.number_checks+" "+req.query.Combo_Holder)
        Database_Object.setTest_Time_Current(req.query.Total_Time_Holder)
        await Database_Object.saveResponse(req.query.combo,req.query.confidence,req.query.time,req.query.First_Hint_holder,req.query.number_checks,req.query.Combo_Holder,req.query.hover_history,req.query.Eliminated_Answers,req.query.Presentation_Holder)//Presenetation holder is only place holder for check answers
        var end=await Database_Object.getNextQuestion(parseInt(req.query.normal_Question_Index)+1);
        if(end==false){
            var scaled=readScaledScore(Database_Object)
            title="You have reached the end, congratulations. Please review your answers below                       Scaled Score: "+ scaled
            res.render('Ending', {title:title,
                Database_Index: req.query.Database_Index,scaled_score:scaled,
                Final_Questions_holder: await Database_Object.DisplayResultList(),
                normal_Question_Index:req.query.normal_Question_Index,Time_Limit_Holder:Database_Object.Question_Time_Limit,
                Total_Time:Database_Object.getTest_Time_Current()
            })
            Database_Object.send_email("finished,"+Database_Object.Student.Session)
            return;
        };
        Question_object=Database_Object.Last_Question
        //wait Database_Object.initialize_Tag_history();//collect a history of already done Tagged qestions
        //await Database_Object.initializeTagged_List();//erasing past ones
        //Database_Object.orderTagged_List();//Usually means shuffling
    }

    title=Question_object.Number+".)"+" "+Question_object.Question_text;


    var {JSDOM} = require("jsdom");
    var jsdom=require("jsdom")
    var data = fs.readFileSync('./views/register_Question.hbs','utf-8');
    var document = new JSDOM(data).window.document;

    var element=document.createElement("textarea");
    //console.log("Passage Outside"+" "+Question_object.getPassageinside student_test has own property())
    element.value=Question_object.getPassage()

    console.log("timetestcurrent "+Database_Object.getTest_Time_Current())
    res.render('register_Question', {Question_Body_Holder:title, Question_Number: Question_object.Number, Passage_Holder:element.value, Answer_A:Question_object.getOptions()[0],
        Answer_B:Question_object.getOptions()[1],Answer_C:Question_object.getOptions()[2],
        Answer_D: Question_object.getOptions()[3], Answer_E:Question_object.getOptions()[4],
        Database_Index: req.query.Database_Index,
        Eliminated_Answers:Question_object.Eliminated_Answers.join(","),Masked_bool:req.query.Masked_bool,
        Right_Answer:Question_object.Right_Answer,normal_Question_Index:Database_Object.Normal_Index,Tag_Holder:Question_object.Tag,
        Test_Both:Database_Object.Last_Question.Test+" "+Database_Object.Last_Question.Test_Type,
        Test_Both_Holder:Database_Object.Test+";"+Question_object.Number,
        Total_Time_Holder:req.query.Total_Time_Holder,
        First_Hint_holder:Question_object.First_Hint.join(" "),Final_Questions_holder:[],Time_Limit_Holder:Database_Object.Question_Time_Limit,
        Question_Length:Database_Object.List_Questions.length,
        Combo_Holder:Question_object.Response,
        draw_history:Question_object.getDrawHistory().join(" "),
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
router.post('/Question_Loop_Math_1',function(req,res,next){
    //console.log("REq query Database INdesx");
    //console.log("REq query Database Hover_History_Math"+req.body.Draw_Object.length);
    var Database_Object=Current_Sessions[req.body.Database_Index];

    Database_Object.saveDrawHistory(req.body.Draw_Object);
    Database_Object.saveHoverHistory(req.body.Hover_history);
    return;



})
router.get('/Question_Loop_Math',async function(req,res,next){
    console.log("Inside Question_Loop_MATH!!!!!!")
    var {JSDOM} = require("jsdom");
    var jsdom=require("jsdom")
    var data = fs.readFileSync('./views/register_Question.hbs','utf-8');
    var document = new JSDOM(data).window.document;



    var Database_Object=Current_Sessions[req.query.Database_Index]

    console.log("Index being requested"+" "+req.query.normal_Question_Index)
    //console.log("argument passed"+" "+req.query.tagged_Questions_holder);//brings back the index for the tagged question
    if (Database_Object.Count==0){

        ++Database_Object.Count;
        Database_Object.startTime();//Only keeps track of total time.
        Question_object=Database_Object.Last_Question

        //await Database_Object.initialize_Tag_history();//collect a history of already done Tagged qestions
        //await Database_Object.initializeTagged_List();//erasing past ones
        //Database_Object.orderTagged_List();//Usually means shuffling
    }
    else if(req.query.Exit_bool=="true"){
        console.log("Entering Exit_Math")
        console.log("Length before"+Current_Sessions.length)
        Database_Object.SetContinuedEmail(req)
        //Current_Sessions.splice(req.query.Database_Index,1)

        title="Welcome to your Dashboard, "+Database_Object.Student.firstName;
        console.log("Length after+Current_Sessions.length"+Current_Sessions.length)
        res.render('dashboard', {title,FirstName:Database_Object.Student.firstName,LastName:Database_Object.Student.lastName, Email:Database_Object.Student.email })

        return
    }
    else if(parseInt(req.query.Final_Questions_holder)>=0){//the question is begin rendered for review purposes
        console.log("INside Final Review question_MAth "+req.query.Final_Questions_holder.split(" ")[0]+" "+req.query.Final_Questions_holder.split(" ")[1])

        await Database_Object.getNextQuestion_Final_Review(req.query.Final_Questions_holder);
        Question_object=Database_Object.Last_Question //this means that database.LastQuestion remains the same as when you left the main branch (test taking branch)
        var scaled=readScaledScore(Database_Object)
        var element=document.createElement("textarea");
        //console.log("Passage Outside"+" "+Question_object.getPassage())
        element.value=Question_object.getPassage()

        //this.Math_Algo(Question_object.Question_text);
        title=Question_object.Number+".)"+" "+findAllbrackets_Math(Question_object.Math_Question_Text);;
        var optionsList=Question_object.getMathOptions();
        res.render('register_Question_Math', {Question_Body_Display:title, Question_Number: Question_object.Number,Passage_Holder:findAllbrackets_Math(element.value.split(" ")), Answer_A:optionsList[0],
            Answer_B:optionsList[1],Answer_C:optionsList[2],
            Answer_D: optionsList[3], Answer_E:optionsList[4],
            Database_Index: req.query.Database_Index,Final_Questions_holder:await Database_Object.DisplayResultList(scaled),
            Right_Answer:Question_object.Right_Answer,normal_Question_Index:req.query.Final_Questions_holder.split(" ")[0],Tag_Holder:Question_object.Tag,
            Test_Both:Database_Object.Last_Question.Test+" "+Database_Object.Last_Question.Test_Type,
            First_Hint_holder:Question_object.First_Hint.join(" "),Time_Limit_Holder:Question_object.Response,
            draw_history:Database_Object.getNormalLast_Question(req.query.Final_Questions_holder).getDrawHistory().join(" "),
            Image_List_Holder:Question_object.getPicture_png_Objects(),
            Question_Length:Database_Object.List_Questions.length,Presentation_Holder:Question_object.Presentation_Highlight.join(" ")
        })
        return;
    }
    //

    else if( parseInt(req.query.normal_Question_Index)!=parseInt(Database_Object.Last_Question.Number)-1 && Database_Object.Test.includes("Set")==false) {//He switched to a another question number from the buttons
        console.log("Inside get next question at an index_Math")
        console.log("req.time "+req.query.time+" "+req.query.First_Hint_holder+" "+req.query.number_checks)
        Database_Object.setTest_Time_Current(req.query.Total_Time_Holder)
        await Database_Object.saveResponse(req.query.combo,req.query.confidence,req.query.time,req.query.First_Hint_holder,req.query.number_checks,req.query.Combo_Holder,req.query.hover_history,req.query.Eliminated_Answers,req.query.Presentation_Holder)//Presenetation holder is only place holder for check answers
        var end=await Database_Object.getNextQuestion(parseInt(req.query.normal_Question_Index));
        if(end==false){
            var scaled=readScaledScore(Database_Object)
            title="You have reached the end, congratulations. Please review your answers below           Scaled Score: "+scaled
            res.render('Ending_Math', {title:title,
                Database_Index: req.query.Database_Index,scaled_score:scaled,
                Final_Questions_holder:await Database_Object.DisplayResultList(scaled),
                normal_Question_Index:req.query.normal_Question_Index,Total_Time:Database_Object.getTest_Time_Current()

            })
            Database_Object.send_email("finished,"+Database_Object.Student.Session)
            return;
        };
        Question_object=Database_Object.Last_Question
        //await Database_Object.initialize_Tag_history();//collect a history of already done Tagged qestions
        //await Database_Object.initializeTagged_List();//erasing past ones
        //Database_Object.orderTagged_List();//Usually means shuffling

    }
    else if(Database_Object.Test.includes("Set")){///This is for problem sets
        console.log("Inside get next question at an index Problem sets")
        console.log("req.time "+req.query.time+" "+req.query.First_Hint_holder+" "+req.query.number_checks)
        Database_Object.setTest_Time_Current(req.query.Total_Time_Holder)
        await Database_Object.saveResponse(req.query.combo,req.query.confidence,req.query.time,req.query.First_Hint_holder,req.query.number_checks,req.query.Combo_Holder,req.query.hover_history,req.query.Eliminated_Answers,req.query.Presentation_Holder)//Presenetation holder is only place holder for check answers
        var end=await Database_Object.getNextQuestion(parseInt(req.query.normal_Question_Index));
        if(end==false){
            var scaled=readScaledScore(Database_Object)
            title="You have reached the end, congratulations. Please review your answers below           Scaled Score: "+scaled
            res.render('Ending_Math', {title:title,
                Database_Index: req.query.Database_Index,scaled_score:scaled,
                Final_Questions_holder:await Database_Object.DisplayResultList(scaled),
                normal_Question_Index:req.query.normal_Question_Index,Total_Time:Database_Object.getTest_Time_Current()

            })
            Database_Object.send_email("finished,"+Database_Object.Student.Session)
            return;
        };
        Question_object=Database_Object.Last_Question
    }
    else if (req.query.hasOwnProperty("next_question")){
        console.log("Inside next Question_Math "+Database_Object.Test)
        console.log("req.time "+req.query.time+" "+req.query.First_Hint_holder+" "+req.query.number_checks+" "+req.query.Combo_Holder)
        Database_Object.setTest_Time_Current(req.query.Total_Time_Holder)
        await Database_Object.saveResponse(req.query.combo,req.query.confidence,req.query.time,req.query.First_Hint_holder,req.query.number_checks,req.query.Combo_Holder,req.query.hover_history,req.query.Eliminated_Answers,req.query.Presentation_Holder)//Presenetation holder is only place holder for check answers
        var end=await Database_Object.getNextQuestion(parseInt(req.query.normal_Question_Index)+1);
        if(end==false){
            var scaled=readScaledScore(Database_Object)
            title="You have reached the end, congratulations. Please review your answers below                       Scaled Score: "+ scaled
            res.render('Ending_Math', {title:title,
                Database_Index: req.query.Database_Index,scaled_score:scaled,
                Final_Questions_holder: await Database_Object.DisplayResultList(),
                normal_Question_Index:req.query.normal_Question_Index,Time_Limit_Holder:Database_Object.Question_Time_Limit,
                Total_Time:Database_Object.getTest_Time_Current()
            })
            Database_Object.send_email("finished,"+Database_Object.Student.Session)
            return;
        };
        Question_object=Database_Object.Last_Question
        //wait Database_Object.initialize_Tag_history();//collect a history of already done Tagged qestions
        //await Database_Object.initializeTagged_List();//erasing past ones
        //Database_Object.orderTagged_List();//Usually means shuffling
    }

    title=Question_object.Number+".)"+" "+findAllbrackets_Math(Question_object.Math_Question_Text);;
    var optionsList=Question_object.getMathOptions();

    var {JSDOM} = require("jsdom");
    var jsdom=require("jsdom")
    var data = fs.readFileSync('./views/register_Question.hbs','utf-8');
    var document = new JSDOM(data).window.document;

    var element=document.createElement("textarea");
    //console.log("Passage Outside"+" "+Question_object.getPassageinside student_test has own property())
    element.value=Question_object.getPassage()

    //console.log("timetestcurrent_MATH "+Database_Object.setTest_Time_Current(req.query.Total_Time_Holder))

    console.log("current time correct "+req.query.Total_Time_Holder)

    res.render('register_Question_Math', {Question_Body_Display:title, Question_Number: Question_object.Number, Passage_Holder:findAllbrackets_Math(element.value.split(" ")), Answer_A:optionsList[0],
        Answer_B:optionsList[1],Answer_C:optionsList[2],
        Answer_D: optionsList[3], Answer_E:optionsList[4],
        Database_Index: req.query.Database_Index,
        Eliminated_Answers:Question_object.Eliminated_Answers.join(","),Masked_bool:req.query.Masked_bool,
        Right_Answer:Question_object.Right_Answer,normal_Question_Index:Database_Object.Normal_Index,Tag_Holder:Question_object.Tag,
        Test_Both:Database_Object.Last_Question.Test+" "+Database_Object.Last_Question.Test_Type,
        Total_Time_Holder:req.query.Total_Time_Holder,
        First_Hint_holder:Question_object.First_Hint.join(" "),Final_Questions_holder:[],Time_Limit_Holder:Database_Object.Question_Time_Limit,
        Question_Length:Database_Object.List_Questions.length,
        Image_List_Holder:Question_object.getPicture_png_Objects(),//this list is a list of tuples (filename,data)
        Combo_Holder:Question_object.Response,
        draw_history:Question_object.getDrawHistory().join(" "),
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
router.get('/Question_Loop_Science_1',async function(req,res,next){
    console.log("REq query Database Hover_History"+req.body.Hover_history);
    var Database_Object=Current_Sessions[req.body.Database_Index];
    Database_Object.saveHoverHistory(req.body.Hover_history);
    return;


})
router.get('/Question_Loop_Science',async function(req,res,next){
    console.log("Inside Question_Loop_Science!!!!!!")
    var {JSDOM} = require("jsdom");
    var jsdom=require("jsdom")
    var data = fs.readFileSync('./views/register_Question.hbs','utf-8');
    var document = new JSDOM(data).window.document;


    var Database_Object=Current_Sessions[req.query.Database_Index]

    console.log("Index being requested"+" "+req.query.normal_Question_Index+" "+req.query.Masked_bool+' '+Database_Object.Normal_Index)
    //console.log("argument passed"+" "+req.query.tagged_Questions_holder);//brings back the index for the tagged question
    if (Database_Object.Count==0){

        ++Database_Object.Count;
        Database_Object.startTime();//Only keeps track of total time.
        Question_object=Database_Object.Last_Question
        Database_Object.Normal_Index=Question_object.Number-1;
        //await Database_Object.initialize_Tag_history();//collect a history of already done Tagged qestions
        //await Database_Object.initializeTagged_List();//erasing past ones
        //Database_Object.orderTagged_List();//Usually means shuffling
    }
    else if(req.query.Exit_bool=="true"){
        console.log("Entering Exit")
        console.log("Length before"+Current_Sessions.length)

        //Current_Sessions.splice(req.query.Database_Index,1)

        title="Welcome to your Dashboard, "+Database_Object.Student.firstName;
        console.log("Length after+Current_Sessions.length"+Current_Sessions.length)
        res.render('dashboard', {title,FirstName:Database_Object.Student.firstName,LastName:Database_Object.Student.lastName, Email:Database_Object.Student.email })

        return
    }
    else if(parseInt(req.query.Final_Questions_holder)>=0){//the question is begin rendered for review purposes
        console.log("INside Final Review question_Science "+req.query.Final_Questions_holder.split(" ")[0]+" "+req.query.Final_Questions_holder.split(" ")[1])

        await Database_Object.getNextQuestion_Final_Review(req.query.Final_Questions_holder);
        Question_object=Database_Object.Last_Question //this means that database.LastQuestion remains the same as when you left the main branch (test taking branch)

        var element=document.createElement("textarea");
        //console.log("Passage Outside"+" "+Question_object.getPassage())
        element.value=Question_object.getPassage()
        var scaled=readScaledScore(Database_Object)
        //this.Math_Algo(Question_object.Question_text);
        title=Question_object.Number+".)"+" "+findAllbrackets_Math(Question_object.Math_Question_Text);;
        var optionsList=Question_object.getMathOptions();
        res.render('register_Question_Science', {Question_Body_Display:title, Passage_Holder:element.value, Answer_A:optionsList[0],
            Answer_B:optionsList[1],Answer_C:optionsList[2],
            Answer_D: optionsList[3], Answer_E:optionsList[4],
            Database_Index: req.query.Database_Index,Final_Questions_holder:await Database_Object.DisplayResultList(scaled),
            Right_Answer:Question_object.Right_Answer,normal_Question_Index:req.query.Final_Questions_holder.split(" ")[0],Tag_Holder:Question_object.Tag,
            Test_Both:Database_Object.Last_Question.Test+" "+Database_Object.Last_Question.Test_Type,
            First_Hint_holder:Question_object.First_Hint.join(" "),Time_Limit_Holder:Question_object.Response,
            Question_Length:Database_Object.List_Questions.length,Presentation_Holder:Question_object.Presentation_Highlight.join(" ")
        })
        return;
    }
    else if(parseInt(req.query.normal_Question_Index)!=parseInt(Database_Object.Last_Question.Number)-1 ){//He switched to a another question number from the buttons
        console.log("Inside get next question at an index")
        console.log("req.time "+req.query.time+" "+req.query.First_Hint_holder+" "+req.query.number_checks)
        Database_Object.setTest_Time_Current(req.query.Total_Time_Holder)
        await Database_Object.saveResponse(req.query.combo,req.query.confidence,req.query.time,req.query.First_Hint_holder,req.query.number_checks,req.query.Combo_Holder,req.query.hover_history,req.query.Eliminated_Answers,req.query.Presentation_Holder)//Presenetation holder is only place holder for check answers
        var end=await Database_Object.getNextQuestion(parseInt(req.query.normal_Question_Index));
        if(end==false){
            var scaled=readScaledScore(Database_Object)
            title="You have reached the end, congratulations. Please review your answers below           Scaled Score: "+scaled
            res.render('Ending', {title:title,
                Database_Index: req.query.Database_Index,scaled_score:scaled,
                Final_Questions_holder:await Database_Object.DisplayResultList(scaled),
                normal_Question_Index:req.query.normal_Question_Index,Total_Time:Database_Object.getTest_Time_Current()

            })
            Database_Object.send_email("finished,"+Database_Object.Student.Session)
            return;
        };
        Question_object=Database_Object.Last_Question
        //await Database_Object.initialize_Tag_history();//collect a history of already done Tagged qestions
        //await Database_Object.initializeTagged_List();//erasing past ones
        //Database_Object.orderTagged_List();//Usually means shuffling

    }
    else if(Database_Object.Test.includes("Set") ){///This is for problem sets
        console.log("Inside get next question at an index (Next Question)")
        console.log("req.time "+req.query.time+" "+req.query.First_Hint_holder+" "+req.query.number_checks)
        Database_Object.setTest_Time_Current(req.query.Total_Time_Holder)
        await Database_Object.saveResponse(req.query.combo,req.query.confidence,req.query.time,req.query.First_Hint_holder,req.query.number_checks,req.query.Combo_Holder,req.query.hover_history,req.query.Eliminated_Answers,req.query.Presentation_Holder)//Presenetation holder is only place holder for check answers
        var end=await Database_Object.getNextQuestion(parseInt(req.query.normal_Question_Index));
        if(end==false){
            var scaled=readScaledScore(Database_Object)
            title="You have reached the end, congratulations. Please review your answers below           Scaled Score: "+scaled
            res.render('Ending', {title:title,
                Database_Index: req.query.Database_Index,scaled_score:scaled,
                Final_Questions_holder:await Database_Object.DisplayResultList(scaled),
                normal_Question_Index:req.query.normal_Question_Index,Total_Time:Database_Object.getTest_Time_Current()

            })
            Database_Object.send_email("finished,"+Database_Object.Student.Session)
            return;
        };
        Question_object=Database_Object.Last_Question
    }
    else if (req.query.hasOwnProperty("next_question")){
        console.log("Inside next Question")
        console.log("req.time "+req.query.time+" "+req.query.First_Hint_holder+" "+req.query.number_checks+" "+req.query.Combo_Holder)
        Database_Object.setTest_Time_Current(req.query.Total_Time_Holder)
        await Database_Object.saveResponse(req.query.combo,req.query.confidence,req.query.time,req.query.First_Hint_holder,req.query.number_checks,req.query.Combo_Holder,req.query.hover_history,req.query.Eliminated_Answers,req.query.Presentation_Holder)//Presenetation holder is only place holder for check answers
        var end=await Database_Object.getNextQuestion(parseInt(req.query.normal_Question_Index));
        if(end==false){
            var scaled=readScaledScore(Database_Object)
            title="You have reached the end, congratulations. Please review your answers below                       Scaled Score: "+ scaled
            res.render('Ending', {title:title,
                Database_Index: req.query.Database_Index,scaled_score:scaled,
                Final_Questions_holder: await Database_Object.DisplayResultList(),
                normal_Question_Index:req.query.normal_Question_Index,Time_Limit_Holder:Database_Object.Question_Time_Limit,
                Total_Time:Database_Object.getTest_Time_Current()
            })
            Database_Object.send_email("finished,"+Database_Object.Student.Session)
            return;
        };
        Question_object=Database_Object.Last_Question
        //wait Database_Object.initialize_Tag_history();//collect a history of already done Tagged qestions
        //await Database_Object.initializeTagged_List();//erasing past ones
        //Database_Object.orderTagged_List();//Usually means shuffling
    }


    title=Question_object.Number+".)"+" "+findAllbrackets_Math(Question_object.Science_Question_Text);;
    var optionsList=Question_object.getScienceOptions();

    var {JSDOM} = require("jsdom");
    var jsdom=require("jsdom")
    var data = fs.readFileSync('./views/register_Question.hbs','utf-8');
    var document = new JSDOM(data).window.document;

    var element=document.createElement("textarea");
    //console.log("Passage Outside"+" "+Question_object.getPassageinside student_test has own property())
    element.value=Question_object.getPassage()

    console.log("timetestcurrent_Science "+Database_Object.getTest_Time_Current())

    res.render('register_Question_Science', {Question_Body_Display:title, Question_Number: Question_object.Number, Passage_Holder:findAllbrackets_Math(element.value.split(" ")), Answer_A:optionsList[0],
        Answer_B:optionsList[1],Answer_C:optionsList[2],
        Answer_D: optionsList[3], Answer_E:optionsList[4],
        Database_Index: req.query.Database_Index,
        Eliminated_Answers:Question_object.Eliminated_Answers.join(","),Masked_bool:req.query.Masked_bool,
        Right_Answer:Question_object.Right_Answer,normal_Question_Index:Database_Object.Normal_Index,Tag_Holder:Question_object.Tag,
        Test_Both:Database_Object.Last_Question.Test+" "+Database_Object.Last_Question.Test_Type,
        Total_Time_Holder:req.query.Total_Time_Holder,
        First_Hint_holder:Question_object.First_Hint.join(" "),Final_Questions_holder:[],Time_Limit_Holder:Database_Object.Question_Time_Limit,
        Question_Length:Database_Object.List_Questions.length,
        Image_List_Holder:Question_object.getPicture_png_Objects(),//this list is a list of tuples (filename,data)
        Combo_Holder:Question_object.Response,
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
function readScaledScore_Tutor_Review(Database_Object){
    if(Database_Object.Test ==undefined){
        return -1;
    }
    if(Database_Object.Test.includes("Set")){
        return -1;
    }
    const lineByLine = require('n-readlines');

    const liner = new lineByLine('./Scaled_Scores_A09_ACT-English.txt');
    var line;
    var raw_score=Database_Object.getRawScore();
    //console.log("raw_score "+raw_score)
    while (line = liner.next()) {
        var temp_line = line.toString('ascii').split(" ")
        //console.log("comparing "+temp_line[0]+" "+raw_score)

        if (parseInt(temp_line[0])==raw_score){
            //console.log("Found the scaled score!! "+temp_line[1])
            return temp_line[1]
        }
        //console.log("Scaled Scores "+temp_line[0]+" "+temp_line[1]);

    }
}
function findAllbrackets_Math(Question_Text_List){
    //console.log("Entire QUestion going in: "+Question_Text_List)
    //var start=Question_Text_List.indexOf('{',0)
    var count=0
    var final_string=""
    for (var i =0 ;i<Question_Text_List.length;++i){
        if(Question_Text_List[i].includes("<")){
            var math_string=Math_Algo(Question_Text_List[i])
        }
        else{
            math_string=Question_Text_List[i]
        }
        final_string=final_string+" "+math_string;
        //console.log("final string so far: "+final_string)
    }


    return final_string
}

function Math_Algo(section){
    var final_string="";
    //console.log("inside math_science algo "+section)
    var math_string=section
                //document.getElementById('QuestionText').style.height="400px";
    var command_list=["ne","frac","sqrt","gt","ge","le","lt","theta","pi","log","div","overline","angle","begin","end","cr","times","cong","cdot","overleftrightarrow","overparen","triangle","infty","perp","downarrow"]

    math_string=math_string.replace(/</g,"(");

    math_string=math_string.replace(/>/g,")");
    //math_string=math_string.replace(/.$/,")");
    math_string="\\"+math_string;
    var index=0;

    index=math_string.lastIndexOf(")",math_string.length-1);

    var math_string_final=math_string.substring(0, index) + "\\" + math_string.substring(index, math_string.length)
    //console.log("math_string_final: ",math_string_final)
    for (var i=0;i<command_list.length;++i){
        if(math_string_final.indexOf(command_list[i])>-1) {
            if( command_list[i]=="ne" && math_string_final.indexOf("overline")==-1){
                console.log("its a legitame ne")
                var c_start=math_string_final.indexOf(command_list[i])
                math_string_final=math_string_final.substring(0,c_start)+"\\"+math_string_final.substring(c_start)
            }
            else if(command_list[i] == "le" && math_string_final.indexOf("angle") == -1 && command_list[i] == "overleftrightarrow" ){
                console.log("its a legitame le")
                var c_start = math_string_final.indexOf(command_list[i])
                math_string_final = math_string_final.substring(0, c_start) + "\\" + math_string_final.substring(c_start)
            }
            else if(command_list[i] == "angle" && math_string_final.indexOf("triangle") == -1){
                console.log("its a legitame angle")
                var c_start = math_string_final.indexOf(command_list[i])
                math_string_final = math_string_final.substring(0, c_start) + "\\" + math_string_final.substring(c_start)
            }
            else if(command_list[i]!="le" && command_list[i]!="ne" &&command_list[i]!="angle" ){
                console.log("command "+command_list[i])
                var c_start = math_string_final.indexOf(command_list[i])
                math_string_final = math_string_final.substring(0, c_start) + "\\" + math_string_final.substring(c_start)
            }
        }

    }

    //console.log("Final String "+math_string_final)
    return math_string_final;


}

function  readScaledScore(Database_Object){
    console.log("reading scaled score "+Database_Object.Test)
    if (Database_Object.Test.includes("Set")){
        console.log("Since its a Set PRobkem no scaled score")
        return -1;
    }
        const lineByLine = require('n-readlines');
        const liner = new lineByLine('./Scaled_Scores_A09_ACT-English.txt');
        var line;
        var raw_score=Database_Object.getRawScore();
        console.log("raw_score "+raw_score)
        while (line = liner.next()) {
            var temp_line = line.toString('ascii').split(" ")
            //console.log("comparing "+temp_line[0]+" "+raw_score)

            if (parseInt(temp_line[0])==raw_score){
                console.log("Found the scaled score!! "+temp_line[1])
                return temp_line[1]
            }
            //console.log("Scaled Scores "+temp_line[0]+" "+temp_line[1]);

        }
}
router.get('/SAT',function (req, res, next) {
    console.log("inside SAT!!!!!!")

    res.redirect('/AddQuestions')

})
router.get('/automatedEmail',async function (req,res,next){
    console.log("inside automated Email "+req.query.firstName+" "+req.query.lastName+" "+req.query.email+" "+req.query.Test+" "+req.query.Test_Type+" "+req.query.Session+req.query.get_test+" "+req.query.Number_Questions+" "+req.query.Tag_List)
    console.log("inside automated Email "+req.query.get_test+" "+req.query.show_final)
    if(req.query.get_test=="true"){
        var title="Test: "+req.query.Test+"    ---->>    "+req.query.lastName+", "+req.query.firstName+", "+req.query.email

        var Database_Object=new Database(0,0,Current_Sessions.length,['student',0,0]);
        //Database_Object.setTimeLimit(req.query.Time_Limit_Question,req.query.Time_Limit_Test)
        await Database_Object.SearchStudent_Tests(req.query.firstName,req.query.lastName,req.query.email);
        await Database_Object.getFinishedTest(req.query.Test+" "+req.query.Test_Type+" "+req.query.Session);
        res.render('Ending_1', {title:title,
            Database_Index: Current_Sessions.length,
            Test:req.query.Test,

            tutor_boolean:"false",show_final:"true"
        })
        Current_Sessions.push(Database_Object);
    }

    else if(req.query.show_final=="true"){
        console.log("Ending")
        var Database_Object=Current_Sessions[req.query.Database_Index]
        var scaled=readScaledScore_Tutor_Review(Database_Object)
        var display_list=await Database_Object.DisplayResultList_Tutor_View(scaled);
        var title="All past questions from "+Database_Object.Test+" "+Database_Object.Test_Type+"   "+"        Total Time Display: "+Database_Object.Total_Time_Display+"        Scaled Score:     "+scaled

        res.render('Ending', {title:title,
            Database_Index:Current_Sessions.length ,
            Final_Questions_holder:display_list,

            tutor_boolean:"true",show_final:"false"
        })
    }

})
router.get('/automatedEmail_Student', async function(req,res,next){
    console.log("inside automated Email for students "+req.query.firstName+" "+req.query.lastName+" "+req.query.email+" "+req.query.Test+" "+req.query.Test_Type+" "+req.query.Time_Limit_Question+" "+req.query.Time_Limit_Test+" "+req.query.Number_Questions+" "+req.query.Tag_List+
    req.query.Semi_Tag);

   // var Database_Object=new Database(req.query.Test_Type,"not null",Current_Sessions.length,[req.query.checkbox_time,req.query.checkbox_1,req.query.checkbox_2]);
    //Database_Object.setTimeLimit(req.query.Time_Limit_Question,req.query.Time_Limit_Test)
    var test_list=[req.query.Test]
    var tests=document.createElement('select')
    title="Are you ready? "+req.query.firstName+", to take the ACT?"
    for(var i =0; i<test_list.length;++i){

        var option=document.createElement('option')
        option.value=test_list[i]
        option.text=test_list[i];
        tests.add(option)
    }

    var option=document.createElement('option')
    option.value="Set of Questions (Practice Mode)"
    option.text="Set of Questions (Practice Mode)"
    tests.add(option)




    if(req.query.BookMark!=undefined){//Continuing
        console.log("The student will continue-->BookMark "+req.query.BookMark+" "+req.query.Session);
        if(req.query.Test.includes("Set")){
            var tag_list=document.createElement('select');
            option=document.createElement('option')
            option.value=req.query.Tag_List.toString().replace(/_/g,' ')
            option.text=req.query.Tag_List.toString().replace(/_/g,' ')
            tag_list.add(option)

            var semi_tag=document.createElement('select');
            option=document.createElement('option')
            option.value=req.query.Semi_Tag.toString().replace(/_/g,' ')
            option.text=req.query.Semi_Tag.toString().replace(/_/g,' ')
            semi_tag.add(option)
            res.render('Test_Options',{title,Load_Tags:"true",Number_Questions:req.query.Number_Questions,Tag_List:tag_list, Test_Type_Holder:req.query.Test_Type,FirstName:req.query.firstName,LastName:req.query.lastName,Time_Limit_Test:req.query.Time_Limit_Test,Time_Limit_Question:req.query.Time_Limit_Question,Email:req.query.email,Test:tests,
                Semi_Tags:semi_tag,BookMark:req.query.BookMark,Session:req.query.Session})
        }
        else{
            res.render('Test_Options',{title,Test_Type_Holder:req.query.Test_Type,FirstName:req.query.firstName,LastName:req.query.lastName,Time_Limit_Test:req.query.Time_Limit_Test,
                Time_Limit_Question:req.query.Time_Limit_Question,Email:req.query.email,Test:tests,BookMark:req.query.BookMark,Session:req.query.Session})
        }


    }
    else if(req.query.Test.includes("Set")){//whole new set of questions
        var tag_list=document.createElement('select');
        option=document.createElement('option')
        option.value=req.query.Tag_List.toString().replace(/_/g,' ')
        option.text=req.query.Tag_List.toString().replace(/_/g,' ')
        tag_list.add(option)

        var semi_tag=document.createElement('select');
        option=document.createElement('option')
        option.value=req.query.Semi_Tag.toString().replace(/_/g,' ')
        option.text=req.query.Semi_Tag.toString().replace(/_/g,' ')
        semi_tag.add(option)
        res.render('Test_Options',{title,Load_Tags:"true",Number_Questions:req.query.Number_Questions,Tag_List:tag_list, Test_Type_Holder:req.query.Test_Type,FirstName:req.query.firstName,LastName:req.query.lastName,Time_Limit_Test:req.query.Time_Limit_Test,Time_Limit_Question:req.query.Time_Limit_Question,Email:req.query.email,Test:tests,
        Semi_Tags:semi_tag})

    }
    else{
        res.render('Test_Options',{title,Test_Type_Holder:req.query.Test_Type,FirstName:req.query.firstName,LastName:req.query.lastName,Time_Limit_Test:req.query.Time_Limit_Test,Time_Limit_Question:req.query.Time_Limit_Question,Email:req.query.email,Test:tests})

    }
    //Current_Sessions.push(Database_Object);
})
router.get('/automatedEmail_Student_Send',async function(req,res,next){
    if(req.query.Type_Holder=="Load_Sub_Tags"){
        console.log("inside loadSemiTags_autmated email "+req.query.Tag_List)
        var Database_Object=new Database(req.query.Test_Type,"not null",Current_Sessions.length,[req.query.checkbox_time,req.query.checkbox_1,req.query.checkbox_2]);
        //Database_Object.setTimeLimit(req.query.Time_Limit_Question,req.query.Time_Limit_Test)
        if(req.query.Test_Type=="ACT-Math"){
            console.log("Loading Math Results_automatedemail "+req.query.Math_Search)
            var test_list=await Database_Object.getTests();
            Database_Object.Math_Tag_Sets=req.query.Math_Search;

            var tests=document.createElement('select')
            for(var i =0; i<test_list.length;++i){

                var option=document.createElement('option')
                option.value=test_list[i]
                option.text=test_list[i];
                tests.add(option)
            }
            var option=document.createElement('option')
            option.value='Set'
            option.text="Set of Questions (Practice Mode)"
            tests.add(option)



            var Semi_Tags=await Database_Object.getSemiTags(req.query.Math_Search);
            var semi_tags=document.createElement('select');
            var option=document.createElement('option')
            option.value="Please Choose One"
            option.text="Please Choose One";
            semi_tags.add(option)
            for(var i =0; i<Semi_Tags.length;++i){

                var option=document.createElement('option')
                option.value=Semi_Tags[i]
                option.text=Semi_Tags[i];

                semi_tags.add(option)
            }
            res.render('Test_Options_send_email',{title,Math_Search:req.query.Math_Search,Semi_Tags:semi_tags,Load_Math_Search:"results", Test_Type_Holder:req.query.Test_Type,FirstName:req.query.FirstName,LastName:req.query.LastName,Email:req.query.Email,Test:tests})

            //res.render('Test_Options',{title,Math_Search:req.query.Math_Search,Semi_Tags:semi_tags, Load_Math_Search:"results",Test_Type_Holder:req.query.Test_Type,FirstName:req.query.FirstName,LastName:req.query.LastName,Email:req.query.Email,Test:tests})
            return;
        }
        var test_list=await Database_Object.getTests();
        var tag_list=await Database_Object.getTags();
        var Semi_Tags=await Database_Object.getSemiTags(req.query.Tag_List);
        var tests=document.createElement('select')
        title="Are you ready? "+req.query.FirstName+", to take the ACT?"
        for(var i =0; i<test_list.length;++i){

            var option=document.createElement('option')
            option.value=test_list[i]
            option.text=test_list[i];
            tests.add(option)
        }
        var option=document.createElement('option')
        option.value='Set'
        option.text="Set of Questions (Practice Mode)"
        tests.add(option)


        var tags=document.createElement('select')
        for(var i =0; i<tag_list.length;++i){

            var option=document.createElement('option')
            option.value=tag_list[i]
            option.text=tag_list[i];

            tags.add(option)
        }

        var semi_tags=document.createElement('select');
        var option=document.createElement('option')
        option.value="Please Choose One"
        option.text="Please Choose One";
        semi_tags.add(option)
        for(var i =0; i<Semi_Tags.length;++i){

            var option=document.createElement('option')
            option.value=Semi_Tags[i]
            option.text=Semi_Tags[i];

            semi_tags.add(option)
        }

        res.render('Test_Options_send_email',{title,Semi_Tags:semi_tags,Tag_Holder:req.query.Tag_List, Load_Tags:"true",Test_Type_Holder:req.query.Test_Type,FirstName:req.query.FirstName,LastName:req.query.LastName,Email:req.query.Email,Test:tests,Tag_List:tags})
        //Current_Sessions.push(Database_Object);
        return;

    }
    else if(req.query.Type_Holder=="LoadTags"){
        console.log("inside loadTags_Send email")
        var Database_Object=new Database(req.query.Test_Type,"not null",Current_Sessions.length,[req.query.checkbox_time,req.query.checkbox_1,req.query.checkbox_2]);
        //Database_Object.setTimeLimit(req.query.Time_Limit_Question,req.query.Time_Limit_Test)
        var test_list=await Database_Object.getTests();
        var tag_list=await Database_Object.getTags();


        var tests=document.createElement('select')
        title="Are you ready? "+req.query.FirstName+", to take the ACT?"
        for(var i =0; i<test_list.length;++i){

            var option=document.createElement('option')
            option.value=test_list[i]
            option.text=test_list[i];
            tests.add(option)
        }
        var option=document.createElement('option')
        option.value='Set'
        option.text="Set of Questions (Practice Mode)"
        tests.add(option)
        if (req.query.Test_Type=="ACT-Math"){
            console.log("Rendering the Math Interface")
            res.render('Test_Options_send_email',{title,Load_Math_Search:"true",Test_Type_Holder:req.query.Test_Type,FirstName:req.query.FirstName,LastName:req.query.LastName,Email:req.query.Email,Test:tests});
            return;
        }

        var tags=document.createElement('select');
        var option=document.createElement('option')
        option.value=""
        option.text="Please Select Tag";

        tags.add(option)
        for(var i =0; i<tag_list.length;++i){

            var option=document.createElement('option')
            option.value=tag_list[i]
            option.text=tag_list[i];

            tags.add(option)
        }
        var semi_tags=document.createElement('select');
        var option=document.createElement('option')
        option.value="Please Choose One"
        option.text="Please Choose One";
        semi_tags.add(option)


        res.render('Test_Options_send_email',{title, Semi_Tags:semi_tags,Load_Tags:"true",Test_Type_Holder:req.query.Test_Type,FirstName:req.query.FirstName,LastName:req.query.LastName,Email:req.query.Email,Test:tests,Tag_List:tags})
        //res.render('Test_Options_send_email',{title, Load_Math_Search:"false",Test_Type_Holder:req.query.Test_Type,FirstName:req.query.FirstName,LastName:req.query.LastName,Email:req.query.Email,Test:tests})
        return;
        //Current_Sessions.push(Database_Object);
    }
    else if(req.query.get_test!="true"){
        console.log("inside automatedEmail student send "+req.query.Test+" "+req.query.Test_Type+" "+req.query.LastName+" "+req.query.Time_Limit_Question+" "+req.query.Time_Limit_Test)
        var Database_Object=new Database(req.query.Test_Type,req.query.Test,Current_Sessions.length,[0,0,0]);//keeping record of the index in Current_Session
        Database_Object.setTimeLimit(req.query.Time_Limit_Question,req.query.Time_Limit_Test)
        //Database_Object.setTimeLimit(req.query.Time_Limit_Question,req.query.Time_Limit_Test)
        var id=await Database_Object.getStudentID(req.query.FirstName,req.query.LastName,req.query.Email);//INitializes the Student Object here also
    }


    if(id==false){
        title="Please try again no Student Found with Name:"+req.query.LastName+","+" "+req.query.FirstName
        res.render('Test_Options_send_email',{title, FirstName:req.query.FirstName,LastName:req.query.LastName,Email:req.query.Email})
        return;
    }
    else if(req.query.get_test=="true"){
        console.log("inside loadtests-sending email")
        var Database_Object=new Database(req.query.Test_Type,"not null",Current_Sessions.length,[req.query.checkbox_time,req.query.checkbox_1,req.query.checkbox_2]);
        Database_Object.setTimeLimit(req.query.Time_Limit_Question,req.query.Time_Limit_Test)
        var test_list=await Database_Object.getTests();
        var tests=document.createElement('select')
        title="Are you ready? "+req.query.FirstName+", to take the ACT?"
        for(var i =0; i<test_list.length;++i){

            var option=document.createElement('option')
            option.value=test_list[i]
            option.text=test_list[i];
            tests.add(option)
        }
        var option=document.createElement('option')
        option.value='Set'
        option.text="Set of Questions (Practice Mode)"
        tests.add(option)
        res.render('Test_Options_send_email',{title, FirstName:req.query.FirstName,LastName:req.query.LastName,Email:req.query.Email,Test_Type_Holder:req.query.Test_Type,Test:tests})
        return;

    }
    Database_Object.send_email("send_reminder",req)
    title="Successfully send reminder to :"+req.query.FirstName+" "+req.query.LastName
    res.render('Ending_1', {title:title
    })

})
router.get('/Refresh',async function (req,res,next){
    var Database_Object=Current_Sessions[req.query.Index]


        console.log("inside REfresh_1 "+req.query.Index+" "+Database_Object.Test+" "+Database_Object.Test_Type+" "+Database_Object.Session);
        title="Test: "+Database_Object.Test+" "+Database_Object.Test_Type+" "+Database_Object.Session+"    ---->>    "
        await Database_Object.getFinishedTest(Database_Object.Test+" "+Database_Object.Test_Type+" "+Database_Object.Session);
        console.log("outside of get finishin test");
        res.render('Ending_1', {title:title,
            Database_Index: req.query.Index,
            Test:req.query.Test,
            normal_Question_Index:req.query.normal_Question_Index,
            tutor_boolean:"false",show_final:"true"
        })






})
router.get('/SearchStudent',async function (req,res,next){
    var title="     "
    console.log("/SearchStudent "+req.query.get_test)
    if(req.query.get_test=="true"){//this was done as a warmup to let the lists populate before they are shown
        var Database_Object=Current_Sessions[req.query.Database_Index]
        Database_Object.Student.firstName=req.query.firstName;
        Database_Object.Student.lastName=req.query.lastName;
        Database_Object.Student.email=req.query.email;
        //console.log("/SearchStudent package look like:"+req.query.Test)
        title="Test: "+req.query.Test+"    ---->>    "+req.query.lastName+", "+req.query.firstName+", "+req.query.email

        await Database_Object.getFinishedTest(req.query.Test)

        res.render('Ending_1', {title:title,
            Database_Index: req.query.Database_Index,
            Test:req.query.Test,
            normal_Question_Index:req.query.normal_Question_Index,
            tutor_boolean:"false",show_final:"true"
        })

        return
    }
    else if(req.query.show_final=="true"){//Actualy question lists shown just like the Ending for the student (with minor changes)
        var Database_Object=Current_Sessions[req.query.Database_Index]
        console.log("ABout to show final resulkts "+req.query.Database_Index)
        //res.render('SearchStudent',{title, Tests_Returned:"false",Test_Type_Holder:req.query.Test_Type,FirstName_Holder:req.query.firstName,LastName_Holder:req.query.lastName,email_Holder:req.query.email,Test_Holder:req.query.Test,get_test:"false", Database_Index:req.query.Database_Index})
        var scaled=readScaledScore_Tutor_Review(Database_Object)
        var display_list=await Database_Object.DisplayResultList_Tutor_View(scaled);
        var title="All past questions from "+Database_Object.Test+" "+Database_Object.Test_Type+"   "+"        Total Time Display: "+Database_Object.Total_Time_Display+"        Scaled Score:     "+scaled
        if(Database_Object.Test_Type=="ACT-Math"){
            res.render('Ending_Math', {title:title,
                Database_Index: req.query.Database_Index,
                Final_Questions_holder:display_list,
                normal_Question_Index:req.query.normal_Question_Index,
                tutor_boolean:"true",show_final:"false"
            })
            return;
        }
        res.render('Ending', {title:title,
            Database_Index: req.query.Database_Index,
            Final_Questions_holder:display_list,
            normal_Question_Index:req.query.normal_Question_Index,
            tutor_boolean:"true",show_final:"false"
        })
        return;

    }
    else if (req.query.get_test=="false"){///The user just wants to send the Student an email
        console.log("inside student_test has own property "+req.query.FirstName)
        title="Select the options you want to students to take the Test under...."

        //res.render('Test_Options',{title, Test_Type_Holder:req.query.Test_Type,FirstName:req.query.FirstName,LastName:req.query.LastName,Email:req.query.Email,Test:tests})
        res.render('Test_Options_send_email',{title, FirstName:req.query.firstName,LastName:req.query.lastName,Email:req.query.email})
        return;
    }
    else if(req.query.Exit_bool=="true"){

        var Database_Object=Current_Sessions[req.query.Database_Index]
        var test_list=await Database_Object.SearchStudent_Tests(req.query.firstName_holder,req.query.lastName_holder,req.query.email_holder);

        var tests=document.createElement('select')
        var option=document.createElement('option')
        option.value="None"
        option.text="Please Select a Test";
        tests.add(option)
        title="Now Select a Test the Student has done"
        for(var i =0; i<test_list.length;++i){

            var option=document.createElement('option')
            option.value=test_list[i]
            option.text=test_list[i];
            tests.add(option)
        }
        res.render('SearchStudent',{title, Database_Index:Current_Sessions.length, Tests_Returned:"true",Test_Type_Holder:req.query.Test_Type,FirstName_Holder:req.query.firstName,LastName_Holder:req.query.lastName,email_Holder:req.query.email,Test:tests,get_test:"true"})

        return;
    }
    console.log("looking for this studenets name: "+req.query.lastName+" "+req.query.firstName+" "+req.query.email);
    var Database_Object=new Database(0,0,Current_Sessions.length,['student',0,0]);
    //Database_Object.setTimeLimit(req.query.Time_Limit_Question,req.query.Time_Limit_Test)
    var test_list=await Database_Object.SearchStudent_Tests(req.query.firstName,req.query.lastName,req.query.email);

    var tests=document.createElement('select')
    var option=document.createElement('option')
    option.value="None"
    option.text="Please Select a Test";
    tests.add(option)
    title="Now Select a Test the Student has done"
    for(var i =0; i<test_list.length;++i){

        var option=document.createElement('option')
        option.value=test_list[i]
        option.text=test_list[i];
        tests.add(option)
    }
    res.render('SearchStudent',{title, Database_Index:Current_Sessions.length, Tests_Returned:"true",Test_Type_Holder:req.query.Test_Type,FirstName_Holder:req.query.firstName,LastName_Holder:req.query.lastName,email_Holder:req.query.email,Test:tests,get_test:"true"})
    Current_Sessions.push(Database_Object);
    return;

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
    title="Welcome to your Dashboard, "+req.body.firstName
    var SQL_Instance=new MYSQLInstance(req.body.firstName,req.body.lastName)


    CurrentSQLInstances.push(SQL_Instance);
    console.log("LENGTH AFTER"+CurrentSQLInstances.length)
    var index=CurrentSQLInstances.length-1

    if (req.body.hasOwnProperty("new_student")){
        console.log("inside new student")
        var Database_Object=new Database(0,0,Current_Sessions.length,['student',0,0]);
        var temp_boolean=await Database_Object.addNewStudent(req.body.firstName,req.body.lastName,req.body.email)
        if(temp_boolean==-1){
            console.log("inside adding new student "+temp_boolean)
            res.render('dashboard', {title,FirstName:req.body.firstName,LastName:req.body.lastName, Email: req.body.email})
            return;
        }

        Database_Object.send_email("registered")
        res.render('dashboard', {title,SQL_Index:index,FirstName:req.body.firstName,LastName:req.body.lastName, Email: req.body.email})
    }
    else{
        res.render('dashboard', {title,SQL_Index:index,FirstName:req.body.firstName,LastName:req.body.lastName, Email: req.body.email})
    }


})
router.get('/Charts',async function (req, res, next){

    var sql_instance= CurrentSQLInstances[req.query.SQL_Index]
    console.log("INSIDE CHARTS ROUTER"+" "+req.query.student_input+" "+req.query.deeper_query);
    console.log("sql certification? "+sql_instance.certification);
    if(req.query.deeper_query.length>0){
        console.log("Deeper query once Students has been inputted ");
        await sql_instance.run_deeperQuery(req.query.deeper_query,function(err,rows){
            console.log("done with deeper query")
        })
        await sql_instance.run(req.query.FirstName,req.query.LastName,req.query.student_input,req.query.deeper_query,function(err,rows){
            if(!err){
                //console.log(rows);

            }else{
                console.log(err);}
        })
        res.render('dashboard', {title:"DEEPER QUERY",deeper_query:"true",deeper_query_options:req.query.deeper_query+","+sql_instance.QuizNames.join(","),certification: sql_instance.certification.toString(),SQL_Index:req.query.SQL_Index,data_table:sql_instance.Collections,

            student_input_server:req.query.student_input,FirstName:req.query.FirstName,LastName:req.query.LastName, Email: req.query.email})
        return;
    }
    else if (req.query.student_input!=undefined){
        console.log("INSIDE because SPECIFIC studen input has been detected ")
        await sql_instance.run_search_student(req.query.FirstName,req.query.LastName,req.query.student_input.toLowerCase(),function(err,rows){
            if(!err){
                //console.log(rows);

            }else{
                console.log(err);}
        })
        res.render('dashboard', {title,certification: sql_instance.certification.toString(),deeper_query_options:req.query.deeper_query_options,SQL_Index:req.query.SQL_Index,data_table:sql_instance.Collections,student_input_server:req.query.student_input,FirstName:req.query.FirstName,LastName:req.query.LastName, Email: req.query.email})
        return;

    }

    //await sql_instance.run()


    //await sql_instance.run()
    console.log("length of data"+" "+sql_instance.Collections.length)
    res.render('dashboard', {title,certification: sql_instance.certification.toString(),SQL_Index:req.query.SQL_Index,data_table:sql_instance.Collections,FirstName:req.query.FirstName,LastName:req.query.LastName, Email: req.query.email})
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
