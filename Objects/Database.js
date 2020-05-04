var mongoose = require('mongoose');
const async = require('async');
const path = require("path");
const fs = require("fs");
const Reading_table=mongoose.model('ReadingQuestion')
const Math_table=mongoose.model('MathQuestion')
const English_table=mongoose.model('EnglishQuestion')
const Science_table=mongoose.model('ScienceQuestion')
const Passage_table=mongoose.model('Passage')
var Response_table=mongoose.model('Response')
var Student_table=mongoose.model('Student')
var dict;
var dict = {
    "ACT-Reading": Reading_table,
    "ACT-Math": Math_table,
    "ACT-English": English_table,
    "ACT-Science":Science_table
    // etc.
};
var dict_tags={
    "ACT-Reading":"" ,
    "ACT-Math": ["Algebra","Geometry","Probability","Trigonometry","IES",],
    "ACT-English": ["Commas","Agreement","Economy","Context","Vocab","Cat 2","Cat 3"],
    "ACT-Science":""

}
var nodemailer = require('nodemailer');
const Student = require('./Student.js')
const Question = require('./Question.js');
const Math_Question = require('./Math_Question.js')

module.exports= class Database {

    constructor(Test_Type,Test,index,option_list) {//This is Reproducible
        console.log("checkbox list "+option_list[0]+" "+option_list[1]+" "+option_list[2])
        if( Test==null){
            console.log('inside Database COnstructor-->Consturcting Weakness Database'+Test_Type)
            this.List_Questions=[];
            this.Normal_Index=null;
            this.List_TaggedQuestions=[];
            this.List_Tagged_History=[];
            this.List_of_Responses=[];
            this.Time_Limit;
            this.Normal_History=[]
            this.List_DifficultyQuestions=[]
            this.PNGPath=[]
            this.List_WeaknessQuestions=[];
            this.List_Weakness_History=[];
            this.Count=0;
            this.Last_Question;
            this.Last_Index_Requested=-1;
            this.Number_Of_Questions=0;//This one and the above line are needed for Problem Sets
            this.Last_Tagged_Question;
            this.Student=null;
            this.Test_Type=Test_Type
            this.Test;
            this.Question_Time_Limit;
            this.Test_Time_Limit;
            this.Test_Time_Current;
            this.CheckBox_List=option_list.join(" ")
            this.Total_Time_Display;
            this.Session;
        }
        else if(Test_Type==0){
            console.log("inside search student database constructor")
            this.Student=null;
            this.List_Questions=[];
        }
        else if(Test_Type=="MISC"){
            console.log('inside Database Adding COnstructor'+" "+this.database_index)
            this.database_index=index  ;
            this.Last_Index_Requested=-1
            this.Number_Of_Questions=0;//This one and the above line are needed for Problem Sets
            console.log('inside Database Normal COnstructor_MISC'+" "+this.database_index)
            this.List_Questions=[];
            this.Normal_Index=null;
            this.List_TaggedQuestions=[];
            this.List_Tagged_History=[];
            this.Time_Limit;
            this.Normal_History=[]
            this.List_DifficultyQuestions=[]
            this.PNGPaths=[]
            this.List_WeaknessQuestions=[];
            this.List_Weakness_History=[];
            this.Count=0;
            this.Last_Question;
            this.Last_Tagged_Question;
            this.Student=null;
            this.Test_Type=Test_Type;
            this.set_boolean=false;//this is to see if the student has select a shortened test of 10 questions

            this.Test=Test;

            this.Question_Time_Limit;
            this.Test_Time_Limit;
            this.Test_Time_Current;
            this.CheckBox_List=option_list.join(" ")
            this.Total_Time_Display;

            ////below are just temp for reading it reading questi  ons
            this.Answer="";
            this.Tag="";
            this.Question_Body=""
            this.Session;
            if (option_list[2]=="Clues"){
                this.Confidence=true;
                return
            }
            this.Confidence=false;
        }
        else if(Test!=null){
            this.database_index=index  ;

            console.log('inside Database Normal COnstructor'+" "+this.database_index)
            this.List_Questions=[];
            this.Normal_Index=null;
            this.Last_Index_Requested=-1
            this.Number_Of_Questions=0;//This one and the above line are needed for Problem Sets
            this.List_TaggedQuestions=[];
            this.List_Tagged_History=[];
            this.Time_Limit;
            this.Normal_History=[]
            this.List_DifficultyQuestions=[]
            this.PNGPaths=[]
            this.List_WeaknessQuestions=[];
            this.List_Weakness_History=[];
            this.Count=0;
            this.Last_Question;
            this.Last_Tagged_Question;
            this.Student=null;
            this.Test_Type=Test_Type;
            this.set_boolean=false;//this is to see if the student has select a shortened test of 10 questions
            if(Test.includes("Set of")){
                // console.log("it does contain Set of: "+Test.substring(0,Test.indexOf('-')))
                this.Test=Test.substring(0,Test.indexOf('-'))
                this.set_boolean=true;
            }
            else{
                this.Test=Test;
                this.set_boolean=false;
            }
            this.Test=Test;

            this.Question_Time_Limit;
            this.Test_Time_Limit;
            this.Test_Time_Current;
            this.CheckBox_List=option_list.join(" ")
            this.Total_Time_Display;

            ////below are just temp for reading it reading questi  ons
            this.Answer="";
            this.Tag="";
            this.Question_Body=""
            this.Session;
            if (option_list[2]=="Clues"){
                this.Confidence=true;
                return
            }
            this.Confidence=false;

        } //If the Constructor that carries a lot is to be called
        else{
            this.database_index ;
           // console.log('inside Database COnstructor-->Consturcting Weakness Database')
            this.List_Questions=[];
            this.Last_Index_Requested=-1;
            this.Number_Of_Questions=0;//This one and the above line are needed for Problem Sets
            this.Normal_Index=null;
            this.List_TaggedQuestions=[];
            this.List_Tagged_History=[];
            this.PNGPaths=[];
            this.Time_Limit;
            this.Normal_History=[]
            this.List_DifficultyQuestions=[]

            this.List_WeaknessQuestions=[];
            this.List_Weakness_History=[];
            this.Count=0;
            this.Last_Question;
            this.Last_Tagged_Question;
            this.Student=null;
            this.Test_Type;
            this.Test;
            this.Question_Time_Limit;
            this.Test_Time_Limit;
            this.Test_Time_Current=0;
            this.CheckBox_List=option_list.join(" ")
            this.Total_Time_Display;
            this.Session;
        }//The constructor to form Weakness Questions


    }
    setPermission(LastName){
        this.Student=LastName;
    }
    setTimeLimit(question_time_limit,test_time_limit ){

        this.Question_Time_Limit=question_time_limit;
        if (test_time_limit.length==0){
            this.Test_Time_Limit=0;
        }
        else{
            this.Test_Time_Limit=test_time_limit
        }

        console.log("Setting time"+this.Question_Time_Limit+" "+ this.Test_Time_Limit);
    }
    updateCurrentTime(timer){
        this.Test_Time_Current=timer;
    }
    setPNGfile(path){
       this.PNGPath=path;
    }
    setPNGfiles(paths){//paths is a list, this fucntion is called in "preparation" to add the rest of the SCeince/Math question
        this.PNGPaths=paths;
        //console.log("after reverseal "+this.PNGPaths)
    }
    send_email(argument,req){
        console.log("argument in email "+argument)
        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'krupnickapproach@gmail.com',
                pass: '421854torres'
            }
        });
        if(argument=='started'){


            var mailOptions = {
                from: 'bot@gmail.com',
                to: 'davidtorres7888@gmail.com',
                subject: this.Student.firstName+" "+this.Student.lastName+" just signed in to take: "+this.Test+" "+this.Test_Type,
                text: 'That was easy!'
            };


        }
        else if(argument.includes("finished")){
            var string="http://ec2-13-58-234-92.us-east-2.compute.amazonaws.com:4000/dashboard/automatedEmail?"+"firstName="+this.Student.firstName+"&"+"lastName="+this.Student.lastName+"&"+"email="+this.Student.email+"&"+"Test="+this.Test+"&"+
                "Test_Type="+this.Test_Type+"&"+"Session="+argument.split(",")[1]+"&"+"get_test=true&"
            var mailOptions = {
                from: 'bot@gmail.com',
                //to: 'davidtorres7888@gmail.com,joekrupnick@gmail.com,cameronmarshall.gong@gmail.com',
                to: 'davidtorres7888@gmail.com,joekrupnick@gmail.com',
                subject: this.Student.firstName+" "+this.Student.lastName+" just finished: "+this.Test+" "+this.Test_Type,
                text: 'That was easy!',


                html: '<p>Click <a href='+string+'>here</a> to go see the results</p>'
            };
        }
        else if(argument=="registered") {
            var mailOptions = {
                from: 'bot@gmail.com',
                to:'davidtorres7888@gmail.com,',
                subject: this.Student.firstName+" "+this.Student.lastName+" was just registered on the system: ",
                text: 'That was easy!'
            };
        }
        else if(argument=="send_reminder"){
            var tag_list=""
            var semi_tag=""
            this.Test=this.Test.replace(/ /g, '_')
            if(req.query.Tag_List!=undefined){
                tag_list=req.query.Tag_List.replace(/ /g, '_')
                semi_tag=req.query.Semi_Tags.replace(/ /g,'_')
            }

            console.log("Sending Time LImits: "+this.Question_Time_Limit+" "+this.Test_Time_Limit+" "+this.Test_Type+" "+this.Test+" "+tag_list+" "+semi_tag)
            var string="http://ec2-13-58-234-92.us-east-2.compute.amazonaws.com:4000/dashboard/automatedEmail_Student?"+"firstName="+this.Student.firstName+"&"+"lastName="+this.Student.lastName+"&"+"email="+this.Student.email+"&"+"Test="+this.Test+"&"+
                "Test_Type="+this.Test_Type+"&"+"Time_Limit_Question="+this.Question_Time_Limit+"&"+"Time_Limit_Test="+this.Test_Time_Limit+"&"+"Tag_List="+tag_list+"&"+"Number_Questions="+req.query.Number_Questions+"&"+
                "Semi_Tag="+semi_tag
            console.log("The complete string "+string)
            var mailOptions = {
                from: 'bot@gmail.com',
                to: this.Student.email,
                subject: "Please take the following Exam at your convenience: "+this.Test+" "+this.Test_Type,
                text: "",
                html: '<b>Dont forget to input a time for each question and the Total Time the Test should take. Please use this email to bring up any issues.   </b><p>Click <a href='+string+'>here</a> to go take the test</p>'
            };
        }
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
    startTime(){

        var timer2=this.Test_Time_Limit+":00"
        this.Test_Time_Current=timer2;
        var _this=this;
        var interval=setInterval(function () {
            _this.updateCurrentTime(timer2)

            //console.log("Setting time "+_this.Test_Time_Current)
            //by parsing integer, I avoid all extra string processing
            var minutes = parseInt(timer2.split(":")[0], 10);
            var seconds = parseInt(timer2.split(":")[1], 10);
            --seconds;

            if(seconds < 0) {
                --minutes ;
                seconds=59;
            }
            if (minutes < 0){
                //console.log("inside negative")




                //this.Test_Time_Current=0;
                //clearInterval(interval);

            }


            //minutes = (minutes < 10) ?  minutes : minutes;

            timer2 = minutes.toString() + ':' + seconds.toString();
            //console.log("timer2 "+timer2)
        }, 1000);


    }
    // Adding a method to the constructor
    setTest_Time_Current(current_time){
        this.Test_Time_Current=current_time;
    }
    getTest_Time_Current(){

        if (this.Test_Time_Current==0){
            console.log("Test Time is nullified")
            return ""
        }
        else if(this.Test_Time_Current.includes("-")){

            var minutes = parseInt(this.Test_Time_Current.split(":")[0].replace("-",''), 10);
            var seconds = parseInt(this.Test_Time_Current.split(":")[1], 10);
            console.log("Test Time is over, adding it to the total time: "+ (parseInt(this.Test_Time_Limit)+minutes).toString()+":"+seconds.toString())


            return (parseInt(this.Test_Time_Limit)+minutes).toString()+":"+seconds.toString()
        }
        console.log("Total Test Time Current "+this.Test_Time_Current);
        return this.Test_Time_Current
    }
   async InitializeQuestions(given_tag,semi_tag,number_of_questions,erase_history){
        console.log("inside initilze question for tags "+given_tag+" "+semi_tag)
        if (this.Test_Type=="ACT-Math" && semi_tag!=undefined ){
            console.log("Math_Tag: "+given_tag)
            if(erase_history=="True"){
                await this.initialize_Tag_history(given_tag)//this doesnt really take in considereation the tag given, just recalls from the response table and aggragrates on right constraints
            }

            given_tag=semi_tag;

            await this.initializeTagged_List_regex(given_tag,number_of_questions);//this collects all questions that have tags with regex

        }
        else if (given_tag!=undefined){
            if(erase_history=="True"){
                await this.initialize_Tag_history(given_tag)//this doesnt really take in considereation the tag given, just recalls from the response table and aggragrates on right constraints
            }

            console.log("done initalizing tagged history "+semi_tag)
            this.Number_Of_Questions=number_of_questions;
            if(semi_tag.includes("Please")==false){
                console.log("Semi tag inputted")
                given_tag=semi_tag;
                await this.initializeTagged_List(given_tag,number_of_questions);
            }
            else{
                console.log("Semi tag NOT inputted")
                await this.initializeTagged_List_regex(given_tag,number_of_questions);//this collects all questions that have tags with regex
            }

            if(this.List_Questions.length==0){
                return;
            }

        }
        else{
            await this.initializeNormal_List()
        }

        this.orderNormal_List()
        //populate the Tag list with new tag (if any changed occured)

    }
    orderTagged_List(){
        //this.List_TaggedQuestions.sort((a, b) => (a.Number > b.Number) ? 1 : -1)
    }
    orderNormal_List(){
        this.List_Questions.sort((a, b) => (parseInt(a.Number) > parseInt(b.Number)) ? 1 : -1)
        this.Last_Question=this.List_Questions[0]

        this.Normal_Index=this.Last_Question.Number
        //var question_length;

        //this.List_Questions=this.List_Questions.slice(0,question_length)
        console.log("size of normal list "+this.List_Questions.length)
    }
    async initialize_Tag_history(tag_selected){//this doesnt really take in considereation the tag given, just recalls from the response table and aggragrates on right constraints
        console.log("initialize Tag History")
        var Question_object=null;
        var temp_history = [];
        var counter=0;
        var dict_schema_1 = {
            "ACT-Reading":"ReadingQuestion" ,
            "ACT-Math": "MathQuestion",
            "ACT-English": "EnglishQuestion",
            "ACT-Science":"ScienceQuestion"
        }
        var dict_schema_2={
            "ACT-Reading":"Reading_Question" ,
            "ACT-Math": "Math_Question",
            "ACT-English": "English_Question",
            "ACT-Science": "Science_Question"
        }
       //Tag:tag_selected
        console.log("tag selected "+tag_selected)
        var temp_Object =  Response_table.find({Student_ID:this.Student.ID,Model_Name:dict_schema_1[this.Test_Type]}).populate(dict_schema_2[this.Test_Type])


        await temp_Object.exec(function(err,Responses){

            if (Responses==null){

              return
            }
            for  (var i=0;i<Responses.length;++i){

                if(Responses[i].Model_Name=="EnglishQuestion" && Responses[i].English_Question.Tag==tag_selected){
                    console.log(Responses[i].English_Question.Test.toString()+" "+Responses[i].English_Question.Test_Type.toString()+" "+Responses[i].English_Question.Number);

                    temp_history.push(Responses[i].English_Question._id.toString())

                }
                else if(Responses[i].Model_Name=="ReadingQuestion" && Responses[i].Reading_Question.Tag==tag_selected){

                    console.log(Responses[i].Reading_Question.Test.toString()+" "+Responses[i].Reading_Question.Test_Type.toString()+" "+Responses[i].Reading_Question.Tag);
                    temp_history.push(Responses[i].Reading_Question._id.toString())

                }
                else if(Responses[i].Model_Name=="MathQuestion" && Responses[i].Math_Question.Tag==tag_selected){

                    console.log(Responses[i].Math_Question.Test.toString()+" "+Responses[i].Math_Question.Test_Type.toString()+" "+Responses[i].Math_Question.Tag);
                    temp_history.push(Responses[i].Math_Question._id.toString())

                }

                else if(Responses[i].Model_Name=="ScienceQuestion" && Responses[i].Science_Question==tag_selected){

                    console.log(Responses[i].Science_Question.Test.toString()+" "+Responses[i].Science_Question.Test_Type.toString()+" "+Responses[i].Science_Question.Tag);
                    temp_history.push(Responses[i].Science_Question._id.toString())
                }
            }

        });
        this.List_Tagged_History=temp_history;
        console.log("length of tagged->Historical questions"+" "+this.List_Tagged_History.length)
    }
    async initializeWeakness_History(){
        var dict_schema_1 = {
            "ACT-Reading":"ReadingQuestion" ,
            "ACT-Math": "MathQuestion",
            "ACT-English": "EnglishQuestion"
        }///associations between the response and the original questions on seperate tables
        console.log("initialize Weakness History"+" "+this.Student.ID+" "+this.Test_Type)
        var Question_object=null;
        var keywords = [];
        var id_holder=[];
        var counter=0;

        //var temp_Object= Response_table.find({Student_ID:this.Student.ID, modelName_1:dict_schema_1[this.Test_Type]}).populate("modelId").lean()
        //temp_Object.populate("Passage_ID").lean()
        var temp_Object = Response_table.find({Student_ID:this.Student.ID, modelName_1:dict_schema_1[this.Test_Type]}).populate({
            path    : 'modelId',
            model:dict_schema_1[this.Test_Type],
            populate: {
                path: 'Passage_ID',
                model: 'Passage'
            }
        });
        await temp_Object.exec(function(err,Responses){
            if (Response.length==0){
                this.List_Weakness_History=[];
                return;
            }
            for  (var i=0;i<Responses.length;++i){


                //console.log("                                                             Question ID                  Student ID     Tag")

                if (Responses[i].modelId.Right_Answer!=Responses[i].Response){
                    //console.log("REsponses returned--Weakness History"+" "+" "+Responses[i].modelId._id+" "+" "+Responses[i].modelId.Tag)
                    var index=id_holder.indexOf(Responses[i].modelId._id);
                    if (index >= 0){
                        ++keywords[index].Repititions;


                    }
                    else{
                        Question_object=new Question(Responses[i].modelId.Question_body.join(" "),Responses[i].modelId.Choices,Responses[i].modelId.Right_Answer,Responses[i].modelId.Tag,Responses[i].modelId.Number,
                            Responses[i].modelId.Passage_ID.Passage.join(' '),Responses[i].modelId.Test_Type,Responses[i].modelId.Test,Responses[i].modelId._id);
                        Question_object.setPresentation_Highlight(Responses[i].modelId.Presentation_Highlight)
                        Question_object.setFirstHint(Responses[i].modelId.Hint_1);
                        Question_object.setResponse(Responses[i].Response);
                        Question_object.setTime_Stamp(Responses[i].time_stamp)
                        Question_object.setTime(Responses[i].Time);
                        keywords[counter]=Question_object
                        id_holder[counter]=Responses[i].modelId._id;
                        ++counter;
                    }

                }

            }

        });
        this.List_Weakness_History=keywords;
        console.log("length of Weakness->Historical questions"+" "+this.List_Weakness_History.length)
        return this.List_Weakness_History.length
    }

    async initializeNormal_List(){
        //This is important and other Normal_List functions are also important because they only refer to when
        //the user selects to do A SINGLE TYPE OF TEST e.g. (READING-74G), this shouldnt be called for any other mode.
        console.log("initializing Normal_List")
        var temp_Object;
        var Question_object;
        var keywords=[]
        var counter=0;


        temp_Object= dict[this.Test_Type].find({Test:this.Test,Test_Type:this.Test_Type}).populate("Passage_ID").lean()
        await temp_Object.exec(function(err,Questions) {


                for  (var i=0;i<Questions.length;++i){


                    //console.log("questions returned "+Questions[i].Question_body.join(" ")+" "+Questions[i].Choices+" "+Questions[i].Number+" "+Questions[i].Passage_ID._id+" "+Questions[i]._id)
                    Question_object=new Question(Questions[i].Question_body.join(" "),Questions[i].Choices,Questions[i].Right_Answer,Questions[i].Tag,Questions[i].Number,Questions[i].Passage_ID.Passage.join(' '),Questions[i].Test_Type,Questions[i].Test,Questions[i]._id)
                    if (Question_object.Test_Type=="ACT-Math"){

                        Question_object.setPNGPictures(Questions[i].Img_List)
                    }
                    if(Question_object.Test_Type=="ACT-Science"){
                        Question_object.setPNGPictures(Questions[i].Img_List)
                    }
                    Question_object.setFirstHint(Questions[i].Hint_1);
                    Question_object.setPresentation_Highlight(Questions[i].Presentation_Highlight)
                    keywords[counter]=Question_object;
                    ++counter;
                }

            });



        this.List_Questions=keywords
        console.log("List of normal questions"+" "+this.List_Questions.length)



    }
    async initializeTagged_List(tag_requested,number_of_problems){
        console.log("initializing Tagged_List "+number_of_problems)

        var keywords = [];

        var temp_History_List=this.List_Tagged_History;
        //console.log("Tag its looking for "+" "+this.Last_Question.Tag)
        //var last_question_id=this.Last_Question._id

        await dict[this.Test_Type].find({Tag:tag_requested}).populate("Passage_ID").lean().exec(function(err,Questions){

            var counter=0;
            var Question_object=null;

                for  (var i=0;i<Questions.length;++i){
                   // console.log("Questions "+Questions[i].Test_Type+" "+Questions[i].Test+" "+Questions[i].Number)
                    if(temp_History_List.indexOf(Questions[i]._id.toString())==-1){

                        for(var j=0;j<Questions[i].Choices.length;++j){
                            Questions[i].Choices[j]=Questions[i].Choices[j].replace(/,/g, ' ');
                        }
                        Question_object=new Question(Questions[i].Question_body.join(" "),Questions[i].Choices,Questions[i].Right_Answer,Questions[i].Tag,Questions[i].Number,Questions[i].Passage_ID.Passage.join(' '),Questions[i].Test_Type,Questions[i].Test,Questions[i]._id)
                        Question_object.setFirstHint(Questions[i].Hint_1);
                        Question_object.setPresentation_Highlight(Questions[i].Presentation_Highlight)
                        if (Question_object.Test_Type=="ACT-Math"){

                            Question_object.setPNGPictures(Questions[i].Img_List)
                        }
                        if(Question_object.Test_Type=="ACT-Science"){
                            Question_object.setPNGPictures(Questions[i].Img_List)
                        }
                        keywords[counter]=Question_object;
                        ++counter;
                        //console.log("counter"+" "+counter+" "+keywords.length);
                    }

                }

        });
        if(number_of_problems.length==0){
            this.List_Questions=keywords;
            console.log("Size of List Tagged Quesstion (minus the history)_no number of problems"+this.List_Questions.length);
            return;
        }
        this.List_Questions=keywords.slice(0, number_of_problems);
        console.log("Size of List Tagged Quesstion (minus the history)"+this.List_Questions.length);
    }

    async initializeWeakness_List(){
        function compare(a,b){
           // console.log("Time stamp comapriosn"+" "+a.Time_Stamp+" "+b.Time_Stamp)
            if ( a.Time_Stamp < b.Time_Stamp ){
                console.log("inside -1")
                return -1;
            }
            if ( a.Time_Stamp > b.Time_Stamp ){
                console.log("inside 1")
                return 1;
            }

            return 0;
        }
        this.List_Weakness_History.sort( compare );
        this.List_WeaknessQuestions= this.List_Weakness_History;
        this.Last_Question=this.List_WeaknessQuestions[0]
        this.Normal_Index=0;
        //

    }



    async getNextWeakQuestion(current_index){
        console.log("Length of Weakness List"+this.List_WeaknessQuestions.length);
        console.log("current"+" "+current_index);
        this.Last_Question=this.List_WeaknessQuestions[current_index];
        this.Normal_Index=current_index;
        return this.Last_Question
    }

    async getSame_TagQuestion(index_argument){
        console.log("Inside getSame_TagQuestion() Database.js"+" "+this.List_TaggedQuestions.length)
        var Choice_List=[]
        ++this.Count
        this.Last_Tagged_Question=this.List_TaggedQuestions[index_argument];

        this.List_TaggedQuestions.splice(index_argument,1)
        if(this.List_TaggedQuestions.length<=2){
            var keywords = [];
            console.log('Replenshing Tagged List'+" "+this.Last_Tagged_Question)
            var temp_History_List=this.List_Tagged_History;

            var last_question_id=this.Last_Tagged_Question._id.toString();
            var temp_object=dict[this.Test_Type].find({Tag:this.Last_Tagged_Question.Tag}).populate("Passage_ID").lean()
            await temp_object.exec(function(err,Questions){

                var counter=0;
                var Question_object=null;
                var index=0;
                // console.log("Table"+artworks)

                    for  (var i=0;i<Questions.length;++i){
                        if(temp_History_List.indexOf(Questions[i]._id.toString())==-1 && last_question_id !=Questions[i]._id.toString()){
                            //console.log("Tag being returned: "+Questions[i].Tag+" "+"Test being returned"+" "+Questions[i].Test);
                            for(var j=0;j<Questions[i].Choices.length;++j){
                                Questions[i].Choices[j]=Questions[i].Choices[j].replace(/,/g, ' ');
                            }

                            Question_object=new Question(Questions[i].Question_body.join(" "),Questions[i].Choices,Questions[i].Right_Answer,Questions[i].Tag,Questions[i].Number,Questions[i].Passage_ID.Passage.join(' '),Questions[i].Test_Type,Questions[i].Test,Questions[i]._id)
                            Question_object.setFirstHint(Questions[i].Hint_1);
                            Question_object.setPresentation_Highlight(Questions[i].Presentation_Highlight)
                            keywords[counter]=Question_object;
                            ++counter;
                            console.log("counter"+" "+counter+" "+keywords.length);
                        }


                    }


            });
            this.List_TaggedQuestions=keywords;
            console.log("Size of List Tagged Quesstion"+this.List_TaggedQuestions.length);
        }



        for (var i=0;i<this.List_TaggedQuestions;++i){
            if(this.List_Tagged_History.includes(this.List_TaggedQuestions[i]._id) ){

                this.List_TaggedQuestions.splice(i,1)
            }
        }


    }
    getSame_DifficultyQuestions(){
        //populate difficulty list (if any change in difficulty occured)
        this.initializeDifficulty_List();
        return;
    }
    getNormalLast_Question(string_package){//This is so that higlights can actually show when tutor is looking back (or student)
        var current_index=parseInt(string_package.split(" ")[0]);
        for (var i=0;i<this.Normal_History.length;++i){
            if((parseInt(this.Normal_History[i].Number)==parseInt(current_index))){
                console.log("normal history last "+parseInt(this.Normal_History[i].Number));
                console.log("getting normal last question "+this.Normal_History[i].getDrawHistory().join(" "))
                return this.Normal_History[i];
            }
        }

    }
    async getNextQuestion_Final_Review(string_package){
        var current_index=parseInt(string_package.split(" ")[0]);

        if (this.Test.includes("Set")){///the final review navigation should work differenttely
            var test_requested=string_package.split(" ")[1]
            console.log("Set Problem Review  "+string_package)

            for (var i=0;i<this.List_Questions.length;++i){
                if((parseInt(this.List_Questions[i].Number)==parseInt(current_index)) && this.List_Questions[i].Test==test_requested){

                    this.Last_Question=this.List_Questions[i];
                    console.log("FOUND the same problem to set Last Question "+this.Last_Question.Test+' '+this.Last_Question.Number)
                    return;
                }
            }


        }


        current_index=current_index-1;
        ++this.Count;
        var Choice_List=[]
        //populate difficulty list (if any change in difficulty occured)
        var keywords=[];

        //console.log("Length of Normal History"+" "+this.Normal_History.length);
        console.log("current_Final_Review"+" "+current_index);
        this.Last_Question=this.List_Questions[current_index];

        //this.Last_Question=this.Normal_History[current_index]
        this.Normal_Index=current_index
        return true;
    }
   async getNextQuestion(current_index){
        console.log("Inside Get ORdered Question_Test TYpe(), Database.js",this.Test," ",this.Test_Type)
       if (current_index>=this.List_Questions.length){
           console.log("Youve reached the end of the line!");
            return false;
       }

        ++this.Count;

        //console.log("Length of Normal History"+" "+this.Normal_History.length);
        console.log("current"+" "+current_index);
        this.Last_Question=this.List_Questions[current_index];
        //console.log("cjoices "+this.Last_Question.Choices)
        this.Normal_Index=current_index
        return true;

    }///Give me all the questions of a test in order 1-10,11-20 etc



    setStudent(Student_Object){
        this.Student=Student_Object
    }
    async SearchQuestion(text,number,Test_Type,Test){
        var temp_Object;
        var Question_object;
        var keywords=[]
        var counter=0;
        var display_list=[]
        console.log("Number outside "+number)
        if(number.length==0){
            //console.log("inside no number")
            temp_Object= dict[Test_Type].find({Test:Test}).populate("Passage_ID").lean();
            await temp_Object.exec(function(err,Questions) {
                for(var i=0;i<Questions.length;++i){
                    //console.log("Questions being established while its searching "+" "+Questions[i].Choices)
                    Question_object=new Question(Questions[i].Question_body.join(" "),Questions[i].Choices,Questions[i].Right_Answer,Questions[i].Tag,Questions[i].Number,Questions[i].Passage_ID.Passage.join(' '),Questions[i].Test_Type,Questions[i].Test,Questions[i]._id)

                    Question_object.setFirstHint(Questions[i].Hint_1);
                    Question_object.setPresentation_Highlight(Questions[i].Presentation_Highlight)
                    keywords[counter]=Question_object;
                    ++counter;

                }

            })
            this.List_Questions=keywords;
            this.orderNormal_List();
            for(var i=0;i<this.List_Questions.length;++i){
                display_list.push(this.List_Questions[i].Number+";"+this.List_Questions[i].Test_Type+";"+this.List_Questions[i].Test+";"+this.List_Questions[i].Tag.replace(/, /g,"_"))
            }
            return display_list;
        }
        temp_Object= dict[Test_Type].findOne({Test:Test,Number:number}).populate("Passage_ID").lean()
        await temp_Object.exec(function(err,Question_re) {

                if (Question_re==null){
                    return 0;
                }
                console.log("INside find One()"+Question_re.Number)


                Question_object=new Question(Question_re.Question_body.join(" "),Question_re.Choices,Question_re.Right_Answer,Question_re.Tag,Question_re.Number,Question_re.Passage_ID.Passage.join(' '),Question_re.Test_Type,Question_re.Test,Question_re._id)
                               // new Question(Questions[i].Question_body.join(" "),Questions[i].Choices,Questions[i].Right_Answer,Questions[i].Tag,Questions[i].Number,Questions[i].Passage_ID.Passage.join(' '),Questions[i].Test_Type,Questions[i].Test,Questions[i]._id)
                if (Question_object.Test_Type=="ACT-Math"){
                    Question_object.setPNGPictures(Question_re.Img_List)
                    Question_object.setPNG_PlaceHolder(Question_re.Img_List)
                }
                else if(Question_object.Test_Type=="ACT-Science"){
                    Question_object.setPNGPictures(Question_re.Img_List)
                    Question_object.setPNG_PlaceHolder(Question_re.Img_List)
                }
                Question_object.setFirstHint(Question_re.Hint_1);
                Question_object.setPassageID(Question_re.Passage_ID._id);

                console.log("Passage_ID_OLD "+Question_re.Passage_ID._id)
                Question_object.setID(Question_re._id)
                Question_object.setPresentation_Highlight(Question_re.Presentation_Highlight)
                keywords[counter]=Question_object;
                //++counter;


        });
        console.log("How many questions were returned?"+" "+keywords.length);

        this.Last_Question=keywords[0];
        return keywords.length
    }
    getSame_MethodQuestion(Question_Object){
        var Choice_List=[]

        dict[this.Test_Type].find({Tag:Question_Object.getTag() },'Question_body Choices Tag').then( (artworks) => {
            var keywords = [];
            var counter=0;
            var Question_object=null;
            // console.log("Table"+artworks)
            artworks.forEach( (artwork) => {

                console.log("Question"+artwork.Question_body.join(" "))
                //console.log("Choices"+artwork.Choices[counter].replace(/,/g, ' '))
                console.log("Tag"+artwork.Tag)

                for(var i=0;i<artwork.Choices.length;++i){
                    artwork.Choices[i]=artwork.Choices[i].replace(/,/g, ' ');
                }
                console.log("Choices"+artwork.Choices)
                console.log(" ")
                Question_object=new Question(artwork.Question_body.join(" "),artwork.Choices,artwork.Tag)
                keywords[counter]=Question_object;
                ++counter;
            });
            this.List_Questions=keywords;
            console.log("List of QUestions"+this.List_Questions);
            // Now do your job with all the retrieved keywords
        });




    }
    comparePassages(P1,P2){

        var List_P1=P1.toString().split(",")
        var List_P2=P2.toString().split(",")

        var i=0;
        var temp_list=[];
        var temp_list2=[];
        var count=0;

        while(temp_list.length<6 && List_P2.length>i){
            //console.log("list p2 "+List_P2[i])
            if(List_P1[i]==undefined){
                break;
            }
            if (List_P1[i].toString().length>5){
                temp_list.push(List_P1[i].toString());
                if(temp_list2.indexOf(List_P1[i].toString())>0){
                    ++count;

                }
            }
            if(List_P2[i].toString().length>5){
                temp_list2.push(List_P2[i].toString())
                if (temp_list.indexOf(List_P2[i].toString())>0){
                    ++count;
                }
            }

            ++i
        }
        //console.log("Long Word List"+" "+temp_list)
       // console.log("Long Word List"+" "+temp_list2)
        if (count>3){
            console.log("Same passage")

            return true;
        }
        return false;


    }
    async addScienceQuestion(BodyList,new_passageId){
        var newQuestion;
        var temp_image_list=this.PNGPaths;
        newQuestion = new dict[BodyList[8][0]]({
            Question_body: BodyList[0],
            Passage_ID:new_passageId,
            Tag:BodyList[6].join(" "),
            Choices:[BodyList[1],BodyList[2],BodyList[3],BodyList[4],BodyList[5]],
            Test:BodyList[7][0],
            Test_Type: BodyList[8][0],
            Right_Answer: BodyList[9][0],
            Number: BodyList[11][0],
            Hint_1:BodyList[12],
            Presentation_Highlight:BodyList[13],
            Img_List:temp_image_list

        });

        newQuestion.save(function (err,object) {
            if (err) {
                console.log("Error caough_Question"+err.toString())
            }


            //const title='Successful Entry of Question, if you would like to enter new questions please do below...'
            //res.render('AddQuestions',{ title })
        });
        console.log("Successfully save Science Question ")
    }
    async addNewScienceQuestion(BodyList,new_passageId){
        var newQuestion;
        var temp_image_list=this.PNGPaths;

        //console.log("length of the picture list "+temp_image_list)
        newQuestion = new dict[BodyList[8][0]]({
            Question_body: BodyList[0],
            Passage_ID:new_passageId,
            Tag:BodyList[6].join(" "),
            Choices:[BodyList[1],BodyList[2],BodyList[3],BodyList[4],BodyList[5]],
            Test:BodyList[7][0],
            Test_Type: BodyList[8][0],
            Right_Answer: BodyList[9][0],
            Number: BodyList[11][0],
            Hint_1:BodyList[12],
            Presentation_Highlight:BodyList[13],
            Img_List:temp_image_list

        });
        newQuestion.save(function (err,object) {
            if (err) {
                console.log("Error caough_Question"+err.toString())
            }
        });

        console.log("Successfully save Science Question ")
    }
    async addNewMathQuestion(BodyList,new_passageId){
        var newQuestion;
        var temp_image_list=this.PNGPaths;

        //console.log("length of the picture list "+temp_image_list)
        newQuestion = new dict[BodyList[8][0]]({
            Question_body: BodyList[0],
            Passage_ID:new_passageId,
            Tag:BodyList[6].join(" "),
            Choices:[BodyList[1],BodyList[2],BodyList[3],BodyList[4],BodyList[5]],
            Test:BodyList[7][0],
            Test_Type: BodyList[8][0],
            Right_Answer: BodyList[9][0],
            Number: BodyList[11][0],
            Hint_1:BodyList[12],
            Presentation_Highlight:BodyList[13],
            Img_List:temp_image_list

        });
        newQuestion.save(function (err,object) {
            if (err) {
                console.log("Error caough_Question"+err.toString())
            }
        });

        console.log("Successfully save math Question ")
    }
    async addMathQuestion(BodyList){//We dont know if its new or not yet
        var newQuestion;
        var new_passageId;
        for (var i=0;i<BodyList.length;++i){
            console.log("body list for math "+i+" "+BodyList[i])
        }
        if (this.Last_Question==null){///This happens in case user accidently submits a new one if its already there
            console.log("Inside this.last_question==nulll, probably a new question")


        }
        else if(await this.SearchQuestion("",this.Last_Question.Number,this.Last_Question.Test_Type,this.Last_Question.Test)==1){ //he properly recalss the quesiton first to Edit
            console.log("Question Already exists in database so only editing Math Question"+BodyList)


            await this.EditMathQuestion(BodyList)
            this.Last_Question=null;
            return

        }
        console.log("its a new question_Math"+" "+BodyList[12])
        var global=true;
        var temp_objects=await Passage_table.find({});
        console.log("length of passages being returned_Math"+" "+temp_objects.length)
        //Checks to see if the new Passage exists already in the database
        //if(BodyList[10].length>3){
          //  for(var i=0;i<temp_objects.length;++i){
                //console.log("Passage being returned" + " "+i+ + temp_objects[i]._id);
                //if (temp_objects[i].Passage.length>1 ){

                   // if( this.comparePassages(temp_objects[i].Passage,BodyList[10])){
                       // console.log("Passage already in database" + " " +temp_objects[i].id);
                       // new_passageId=temp_objects[i].id
                      //  global=false;
                      //  break;
                   // }
              //  }

           // }
     //   }

        console.log("global "+global)
        if(global){

            var newPassage = new Passage_table({
                Passage: BodyList[10],
                Picture_Path: ""
            });
            await newPassage.save(function (err, object) {
                if (err) {
                    console.log("Error caough_passage" + err.toString())
                }

                console.log("New Passage_ID" + " " + object.id)
                new_passageId = object.id;

            });
        }

        await this.addNewMathQuestion(BodyList,new_passageId);
        return;



    }
    async addScienceQuestion(BodyList){
        var newQuestion;
        var new_passageId;
        for (var i=0;i<BodyList.length;++i){
            console.log("body list for Science "+i+" "+BodyList[i])
        }
        if (this.Last_Question==null){///This happens in case user accidently submits a new one if its already there
            console.log("Inside this.last_question==nulll, probably a new question")


        }
        else if(await this.SearchQuestion("",this.Last_Question.Number,this.Last_Question.Test_Type,this.Last_Question.Test)==1){ //he properly recalss the quesiton first to Edit
            console.log("Question Already exists in database so only editing Science Question"+BodyList)


            await this.EditScienceQuestion(BodyList)
            this.Last_Question=null;
            return


        }
        console.log("its a new question"+" "+BodyList[12])
        var global=true;
        var temp_objects=await Passage_table.find({});
        console.log("length of passages being returned_science"+" "+temp_objects.length)
        //Checks to see if the new Passage exists already in the database
        if(BodyList[10].length>3){
            for(var i=0;i<temp_objects.length;++i){
                //console.log("Passage being returned" + " " + temp_objects[i].Passage);
                if (temp_objects[i].Passage.length>1 ){
                    //console.log("its DEFINED "+temp_objects[i].Passage.length)
                    if( this.comparePassages(temp_objects[i].Passage,BodyList[10])){
                        console.log("Passage already in database" + " " +temp_objects[i].id);
                        new_passageId=temp_objects[i].id
                        global=false;
                        break;
                    }
                }

            }
        }

        console.log("global "+global)
        if(global){

            var newPassage = new Passage_table({
                Passage: BodyList[10],
                Picture_Path: ""
            });
            await newPassage.save(function (err, object) {
                if (err) {
                    console.log("Error caough_passage" + err.toString())
                }

                console.log("New Passage_ID" + " " + object.id)
                new_passageId = object.id;

            });
        }


        await this.addNewScienceQuestion(BodyList,new_passageId);


    }
    async addNewQuestion(BodyList){//just fpr english and reading
        //console.log("Inside adding new Question in Database: Passage-->"+" "+BodyList[10]+"Question Body"+BodyList[0]+"Tag::  "+BodyList[6].join(" "))
        var newQuestion;
        var new_passageId;

        if (this.Last_Question==null){///This happens in case user accidently submits a new one if its already there
            console.log("Inside this.last_question==nulll, probably a new question")


        }
        else if(await this.SearchQuestion("",this.Last_Question.Number,this.Last_Question.Test_Type,this.Last_Question.Test)==1){ //he properly recalss the quesiton first to Edit
            console.log("Question Already exists in database so only editing: , editing branch"+BodyList)

            new_passageId=await this.EditQuestion(BodyList)
            this.Last_Question=null;
            return;
        }
        console.log("its a new question"+" "+BodyList[12])
        var global=true;
        var count=0;
        var temp_objects=await Passage_table.find({});
        console.log("length of passages being returned"+" "+temp_objects.length)
        //Checks to see if the new Passage exists already in the database
        if(BodyList[10].length>3){
            for(var i=0;i<temp_objects.length;++i){
                //console.log("Passage being returned" + " " + temp_objects[i].Passage);
                if (temp_objects[i].Passage.length>1 ){
                   // console.log("its DEFINED "+temp_objects[i]._id+" "+temp_objects[i].Passage+" ");
                    if(temp_objects[i].Passage ==null){
                        console.log("its NOT DEFINED AND SKIPPINg");
                    }
                    ////
                    else if (this.comparePassages(temp_objects[i].Passage,BodyList[10])) {
                        console.log("Passage already in database" + " " +temp_objects[i].id);
                        new_passageId=temp_objects[i].id
                        global=false;
                        break;
                    }
                }
                ++count;
                console.log("count "+count)
            }
        }

        console.log("global "+global)
        if(global){

            var newPassage = new Passage_table({
                Passage: BodyList[10],
                Picture_Path: ""
            });
            await newPassage.save(function (err, object) {
                if (err) {
                    console.log("Error caough_passage" + err.toString())
                }

                console.log("New Passage_ID" + " " + object.id)
                new_passageId = object.id;

            });
        }

        newQuestion = new dict[BodyList[8][0]]({
            Question_body: BodyList[0],
            Passage_ID:new_passageId,
            Tag:BodyList[6].join(" "),
            Choices:[BodyList[1],BodyList[2],BodyList[3],BodyList[4],BodyList[5]],
            Test:BodyList[7][0],
            Test_Type: BodyList[8][0],
            Right_Answer: BodyList[9][0],
            Number: BodyList[11][0],
            Hint_1:BodyList[12],
            Presentation_Highlight:BodyList[13]
        });
        newQuestion.save(function (err,object) {
            if (err) {
                console.log("Error caough_Question"+err.toString())
            }


                //const title='Successful Entry of Question, if you would like to enter new questions please do below...'
                //res.render('AddQuestions',{ title })
        });

    }

    async EditScienceQuestion(BodyList){


        var passage_updated=await Passage_table.update(
            {_id:this.Last_Question.Passage_ID},
            { $set: {"Passage":BodyList[10]}
            });


        var temp_image_list=this.PNGPaths;
        await dict[BodyList[8]].update(
            { _id : this.Last_Question._id },
            { $set: {
                    "Img_List":temp_image_list,
                    "Test_Type": BodyList[8][0],"Number":BodyList[11][0].toString(),
                    "Hint_1" : BodyList[12],"Presentation_Highlight": BodyList[13],
                    "Test":BodyList[7],
                    "Right_Answer": BodyList[9][0],
                    "Choices":[BodyList[1],BodyList[2],BodyList[3],BodyList[4],BodyList[5]],
                    "Question_body": BodyList[0],
                    "Tag":BodyList[6].join(" "),
                }
            }
        )
    }
    async EditMathQuestion(BodyList){
        var passage_updated=await Passage_table.update(
            {_id:this.Last_Question.Passage_ID},
            { $set: {"Passage":BodyList[10]}
            });
        console.log("right before saving "+BodyList[1],BodyList[2],BodyList[3],BodyList[4],BodyList[5])
        var temp_pic_list=this.PNGPaths;
        if (temp_pic_list.length==0){
            temp_pic_list=this.Last_Question.Picture_png_Objects
            console.log("No pics were sent in, setting the last questions List "+this.Last_Question.Picture_png_Objects)
        }
            await dict[BodyList[8]].update(
                { _id : this.Last_Question._id },
                { $set: {
                    "Img_List": temp_pic_list,
                        "Test_Type": BodyList[8][0],"Number":BodyList[11][0].toString(),
                        "Hint_1" : BodyList[12],"Presentation_Highlight": BodyList[13],
                    "Test":BodyList[7],
                    "Right_Answer": BodyList[9][0],
                    "Choices":[BodyList[1],BodyList[2],BodyList[3],BodyList[4],BodyList[5]],
                    "Question_body": BodyList[0],
                    "Tag":BodyList[6].join(" "),
        }
        }
        )

    }
    async EditQuestion(BodyList){
        var Object_ID=-1;
        var global=true;
        console.log("inside Edit Question"+" "+ BodyList)
        console.log("Question you are editing ",this.Last_Question._id+" "+this.Last_Question.Number+" "+BodyList[6]);
        console.log("Passage you are Editing ",this.Last_Question.Passage_ID);


        var newPassage;


        var passage_updated=await Passage_table.update(
            {_id:this.Last_Question.Passage_ID},
            { $set: {"Passage":BodyList[10]}
            });



            await dict[BodyList[8]].update(
                { _id : this.Last_Question._id },
                { $set: {
                        "Test_Type": BodyList[8][0],"Number":BodyList[11][0].toString(),
                        "Hint_1" : BodyList[12],"Presentation_Highlight": BodyList[13],
                        "Test":BodyList[7],
                        "Right_Answer": BodyList[9][0],
                        "Choices":[BodyList[1],BodyList[2],BodyList[3],BodyList[4],BodyList[5]],
                        "Question_body": BodyList[0],
                        "Tag":BodyList[6].join(" "),
                    }
                }
            )


        this.Last_Question=null;
        return Object_ID

    }
    saveHoverHistory(hover_history){
        if(hover_history==undefined){
            return;
        }
        console.log("Setting hover history "+hover_history)
        this.Last_Question.setHover_History(hover_history);
    }
    saveDrawHistory(draw_object){
        if(draw_object==undefined){
            return;
        }
        console.log("draw_object"+draw_object);
        //console.log("draw_object"+draw_object.x +" "+draw_object.y );
        this.Last_Question.addDraw_History(draw_object);
    }
    async saveResponse(response,confidence,time,First_Hint_holder,check_answer,old_answer,hover_history,eliminated_answers,checked_answers){
        console.log("saving response "+response+" "+time+" "+check_answer)
        console.log("saving responses' highlights "+this.Last_Question.Draw_History)
        var Object_ID;
        if (this.CheckBox_List.includes('Clues') && confidence!=undefined){
            console.log("submitted confidence!")
            confidence=parseInt(confidence)
        }
        else{
            confidence=-1
        }
        this.List_Tagged_History.push(this.Last_Question._id.toString());
        this.Last_Question.setResponse_Long(response,confidence,old_answer,eliminated_answers,checked_answers)

        ++this.Last_Question.Views;
        var hint;
        if(First_Hint_holder=="true"){
            hint=true;
            this.Last_Question.setHintSelections(true);
        }
        else{
            hint=false;
            this.Last_Question.setHintSelections(false);
        }
        this.Last_Question.setCheckAnswer(check_answer);

        this.Normal_History.push(this.Last_Question);
        if(time.split(":")[1]!=undefined){
            if (time.split(":")[1].length>2){
                console.log("saving because its negative "+parseInt(time.split(":")[1].split("-")[1]));
                this.Last_Question.setTime((parseInt(time.split(":")[1].split("-")[1]))+parseInt(this.Question_Time_Limit));
            }
            else{

                this.Last_Question.setTime(parseInt(this.Question_Time_Limit)-parseInt(time.split(":")[1]));
            }
        }

        var temp_set=this.Student.Session.toString()
        if (this.Test.includes("Set")){
           temp_set=temp_set+"Set"
        }
        console.log("Going in saving"+" "+response+" "+this.Student.ID+" "+this.Last_Question._id+" "+"hoverhistroy"+this.Last_Question.Hover_History);
        if(this.Test_Type=="ACT-Reading"){
            var newReponse = new Response_table({
                Response:response,
                Student_ID:this.Student.ID,
                Model_Name:"ReadingQuestion",
                Reading_Question:this.Last_Question._id,
                Time:this.Last_Question.getTime(),
                Session:temp_set,
                Hint_Selection:hint,
                Check_Answer:this.Last_Question.Check_Answer,
                Eliminated_Answers:this.Last_Question.Eliminated_Answers,
                Checked_Answers:this.Last_Question.Checked_Answers,
                Views:this.Last_Question.Views,
                Total_Time:this.Test_Time_Current,
                Hover_History:this.Last_Question.Hover_History,
                Draw_History:this.Last_Question.Draw_History,
                Confidence:confidence
            });
            await newReponse.save(function(err,object){
                if (err) {
                    console.log("Error caough"+err.toString())
                }

                Object_ID=object.id;

            });
        }
        else if(this.Test_Type=="ACT-English"){

            var newReponse = new Response_table({
                Response:response,
                Student_ID:this.Student.ID,
                Model_Name:"EnglishQuestion",
                English_Question:this.Last_Question._id,
                Time:this.Last_Question.getTime(),
                Session:temp_set,
                Hint_Selection:hint,
                Check_Answer:this.Last_Question.Check_Answer,
                Eliminated_Answers:this.Last_Question.Eliminated_Answers,
                Checked_Answers:this.Last_Question.Checked_Answers,
                Views:this.Last_Question.Views,
                Total_Time:this.Test_Time_Current,
                Hover_History:this.Last_Question.Hover_History,
                Draw_History:this.Last_Question.Draw_History,
                Confidence:confidence
            });
            await newReponse.save(function(err,object){
                if (err) {
                    console.log("Error caough"+err.toString())
                }

                Object_ID=object.id;

            });
        }
        else if(this.Test_Type=="ACT-Math"){
            //console.log("inside ACT Math Saving")
            var newReponse = new Response_table({
                Response:response,
                Student_ID:this.Student.ID,
                Model_Name:"MathQuestion",
                Math_Question:this.Last_Question._id,
                Time:this.Last_Question.getTime(),
                Session:temp_set,
                Hint_Selection:hint,
                Check_Answer:this.Last_Question.Check_Answer,
                Eliminated_Answers:this.Last_Question.Eliminated_Answers,
                Checked_Answers:this.Last_Question.Checked_Answers,
                Views:this.Last_Question.Views,
                Total_Time:this.Test_Time_Current,
                Hover_History:this.Last_Question.Hover_History,
                Draw_History:this.Last_Question.Draw_History,
                Confidence:confidence
            });
            await newReponse.save(function(err,object){
                if (err) {
                    console.log("Error caough"+err.toString())
                }

                Object_ID=object.id;

            });
        }
        else if(this.Test_Type=="ACT-Science"){
            //console.log("inside ACT Math Saving")
            var newReponse = new Response_table({
                Response:response,
                Student_ID:this.Student.ID,
                Model_Name:"ScienceQuestion",
                Science_Question:this.Last_Question._id,
                Time:this.Last_Question.getTime(),
                Session:temp_set,
                Hint_Selection:hint,
                Check_Answer:this.Last_Question.Check_Answer,
                Eliminated_Answers:this.Last_Question.Eliminated_Answers,
                Checked_Answers:this.Last_Question.Checked_Answers,
                Views:this.Last_Question.Views,
                Total_Time:this.Test_Time_Current,
                Hover_History:this.Last_Question.Hover_History,
                Draw_History:this.Last_Question.Draw_History,
                Confidence:confidence
            });
            await newReponse.save(function(err,object){
                if (err) {
                    console.log("Error caough"+err.toString())
                }

                Object_ID=object.id;

            });
        }
        console.log("Response ID"+" "+Object_ID)
        //also add the question to the Historical questions list maitained at this object

    }
    async getTags(){
        var set = new Set();
        var temp_Object= dict[this.Test_Type].find({}).lean();

        var main_tag_list=dict_tags[this.Test_Type]
        await temp_Object.exec(function(err,Objects) {
            for (var i=0;i<Objects.length ;++i){
               // console.log("Tags being returned "+Objects[i].Tag);
                for (var word in main_tag_list){
                    //console.log("Word "+main_tag_list[word]);
                    if(Objects[i].Tag.includes(main_tag_list[word].toLowerCase())){
                        set.add(main_tag_list[word])
                    }
                }


            }

            //Object.Questions[i].Test
        });
        //console.log("length of tagged list "+Array.from(set).length)
        return Array.from(set)
    }
    async getTests(){ //Seaerches for the tests given the subject
        var set = new Set();
        var temp_Object= dict[this.Test_Type].find({}).lean()
        await temp_Object.exec(function(err,Objects) {
            for (var i=0;i<Objects.length ;++i){

                set.add(Objects[i].Test)
            }

            //Object.Questions[i].Test
        });
        return Array.from(set)
    }
    async initializeTagged_List_regex(Main_Tag,number_of_problems){//collects all questions whose tag contains the regular expression of the main tag
        var string=".*"+Main_Tag.toLowerCase()+".*"
        var temp_History_List=this.List_Tagged_History;

        var Question_object;
        var keywords=[];
        var counter=0;
        var temp_Object= dict[this.Test_Type].find({Tag:{$regex:string}}).populate("Passage_ID").lean();
        await temp_Object.exec(function(err,Questions) {
            for (var i=0;i<Questions.length ;++i){
                if(temp_History_List.indexOf(Questions[i]._id.toString())==-1){

                    for(var j=0;j<Questions[i].Choices.length;++j){
                        Questions[i].Choices[j]=Questions[i].Choices[j].replace(/,/g, ' ');
                    }
                    Question_object=new Question(Questions[i].Question_body.join(" "),Questions[i].Choices,Questions[i].Right_Answer,Questions[i].Tag,Questions[i].Number,Questions[i].Passage_ID.Passage.join(' '),Questions[i].Test_Type,Questions[i].Test,Questions[i]._id)
                    Question_object.setFirstHint(Questions[i].Hint_1);
                    Question_object.setPresentation_Highlight(Questions[i].Presentation_Highlight);
                    if (Question_object.Test_Type=="ACT-Math"){

                        Question_object.setPNGPictures(Questions[i].Img_List)
                    }
                    if(Question_object.Test_Type=="ACT-Science"){
                        Question_object.setPNGPictures(Questions[i].Img_List)
                    }
                    keywords[counter]=Question_object;
                    ++counter;

                }
            }

        });
        if(number_of_problems.length==0){
            this.List_Questions=keywords;
            console.log("Size of List Tagged Quesstion (minus the history)_no number of problems"+this.List_Questions.length);
            return;
        }
        this.List_Questions=keywords.slice(0, number_of_problems);
        console.log("Size of List Tagged Quesstion (minus the history)"+this.List_Questions.length);

    }
    async getSemiTags(Main_Tag){

        var set = new Set();
        var string=".*"+Main_Tag.toLowerCase()+".*"
        console.log("inside getSemiTags "+string);
        var temp_Object= dict[this.Test_Type].find({Tag:{$regex:string}}).lean();

        await temp_Object.exec(function(err,Objects) {
            for (var i=0;i<Objects.length ;++i){
                //console.log("Tags being returned "+Objects[i].Tag);
                set.add(Objects[i].Tag)
                    //console.log("Word "+main_tag_list[word]);

                }

        });
        //console.log("length of tagged list "+Array.from(set).length)
        return Array.from(set)
    }
    async saveNewStudent(first,last,email){
        var Student_ID;
        var newStudent = new Student_table({
            firstName: first,
            lastName: last,
            email: email,
        });
        await newStudent.save(function(err,object){
            if (err) {
                console.log("Error caough"+err.toString())
            }
            console.log("student_ID"+" "+object.id)
            Student_ID=object.id;
        });
        console.log("New Student ID "+Student_ID)
        this.Student.setID(Student_ID)

    }
    recordSession(Question_Object,Student_Object){
        var newSession = new SessionSchema({
            QuestionID: Question_Object.getDatabase_ID(),
            StudentID: Student_Object.getDatabase_ID(),
            Right_Answer: Question_Object.getRightAnswer(),
            Student_Answer: Question_Object.getStudentAnswer(),
            Time: Question_Object.getTime(),
            Test: Question_Object.getTest(),
            Test_Type:Question_Object.getTest_Type()
        });
        newSession.save(function (err) {
            if (err) return handleError(err);
            const title='Successful Entry of Question, if you would like to enter new questions please do below...'
            res.render('AddQuestions',{ title })
        })

    }///Record a session in the Session Schema Table
    async getFinishedTest_Set(list){
        this.Test="Set";
        console.log("getFinishedTest_Set "+list)
        var dict_schema_1 = {
            "ACT-Reading":"ReadingQuestion" ,
            "ACT-Math": "MathQuestion",
            "ACT-English": "EnglishQuestion",
            "ACT-Science":"ScienceQuestion"
        }
        var dict_schema_2={
            "ACT-Reading":"Reading_Question" ,
            "ACT-Math": "Math_Question",
            "ACT-English": "English_Question",
            "ACT-Science": "Science_Question"
        }
        //var temp_Object =  Response_table.find({Student_ID:this.Student.ID,Model_Name:dict_schema_1[list[0]],Session:list[1]}).populate(dict_schema_2[list[0]])
        var temp_Object =  Response_table.find({Student_ID:this.Student.ID,Model_Name:dict_schema_1[list[0]],Session:list[1]}).populate({
            path:dict_schema_2[list[0]],
            populate:{path:'Passage_ID'}

        })
        var keywords=[]

        await temp_Object.exec(function(err,questions){

            if (questions==null){

                return
            }
            for  (var i=0;i<questions.length;++i){

                if(questions[i].Model_Name=="EnglishQuestion"){
                    console.log(questions[i].English_Question.Test.toString()+" "+questions[i].English_Question.Test_Type.toString()+" "+questions[i].English_Question.Tag);

                    var Question_object=new Question(questions[i].English_Question.Question_body.join(" "),questions[i].English_Question.Choices,questions[i].English_Question.Right_Answer,questions[i].English_Question.Tag,questions[i].English_Question.Number,
                        questions[i].English_Question.Passage_ID.Passage.join(" "),questions[i].English_Question.Test_Type,questions[i].English_Question.Test,-1);

                    Question_object.setHover_History(questions[i].Hover_History);
                    Question_object.Checked_Answers=questions[i].Checked_Answers[0].split(",");
                    Question_object.setCheckAnswer(questions[i].Check_Answer)
                    Question_object.setResponse(questions[i].Response);
                    Question_object.setRepeats(questions[i].Repeats);
                    Question_object.setHint_Selection(questions[i].Hint_Selection);
                    Question_object.setViews(questions[i].Views);
                    Question_object.setTotalTime(questions[i].Total_Time.toString());
                    Question_object.setTime(questions[i].Time);
                    Question_object.setTime_Stamp(questions[i].time_stamp)
                    Question_object.setConfidence(questions[i].Confidence)
                    keywords.push(Question_object)

                }
                else if(questions[i].Model_Name=="ReadingQuestion"){

                    console.log(questions[i].Reading_Question.Test.toString()+" "+questions[i].Reading_Question.Test_Type.toString()+" "+questions[i].Reading_Question.Tag);

                    var Question_object=new Question(questions[i].Reading_Question.Question_body.join(" "),questions[i].Reading_Question.Choices,questions[i].Reading_Question.Right_Answer,questions[i].Reading_Question.Tag,questions[i].Reading_Question.Number,
                        questions[i].Reading_Question.Passage_ID.Passage.join(" "),questions[i].Reading_Question.Test_Type,questions[i].Reading_Question.Test,-1);

                    Question_object.setHover_History(questions[i].Hover_History);
                    Question_object.Checked_Answers=questions[i].Checked_Answers[0].split(",");
                    Question_object.setCheckAnswer(questions[i].Check_Answer)
                    Question_object.setResponse(questions[i].Response);
                    Question_object.setRepeats(questions[i].Repeats);
                    Question_object.setHint_Selection(questions[i].Hint_Selection);
                    Question_object.setViews(questions[i].Views);
                    Question_object.setTotalTime(questions[i].Total_Time.toString());
                    Question_object.setTime(questions[i].Time);
                    Question_object.setTime_Stamp(questions[i].time_stamp)
                    Question_object.setConfidence(questions[i].Confidence)
                    keywords.push(Question_object)

                }
                else if(questions[i].Model_Name=="MathQuestion"){

                    console.log(questions[i].Math_Question.Test.toString()+" "+questions[i].Math_Question.Test_Type.toString()+" "+questions[i].Math_Question.Tag);

                    var Question_object=new Question(questions[i].Math_Question.Question_body.join(" "),questions[i].Math_Question.Choices,questions[i].Math_Question.Right_Answer,questions[i].Math_Question.Tag,questions[i].Math_Question.Number,
                        " ",questions[i].Math_Question.Test_Type,questions[i].Math_Question.Test,-1);

                    Question_object.setHover_History(questions[i].Hover_History);

                    Question_object.Checked_Answers=questions[i].Checked_Answers[0].split(",");
                    Question_object.setCheckAnswer(questions[i].Check_Answer)
                    Question_object.setResponse(questions[i].Response);
                    Question_object.setRepeats(questions[i].Repeats);
                    Question_object.setHint_Selection(questions[i].Hint_Selection);
                    Question_object.setViews(questions[i].Views);
                    Question_object.setTotalTime(questions[i].Total_Time.toString());
                    Question_object.setTime(questions[i].Time);
                    Question_object.setTime_Stamp(questions[i].time_stamp)
                    Question_object.setConfidence(questions[i].Confidence)
                    keywords.push(Question_object)

                }

                else if(questions[i].Model_Name=="ScienceQuestion"){

                    console.log(questions[i].Science_Question.Test.toString()+" "+questions[i].Science_Question.Test_Type.toString()+" "+questions[i].Science_Question.Tag);

                    var Question_object=new Question(questions[i].Science_Question.Question_body.join(" "),questions[i].Science_Question.Choices,questions[i].Science_Question.Right_Answer,questions[i].Science_Question.Tag,questions[i].Science_Question.Number,
                        " ",questions[i].Science_Question.Test_Type,questions[i].Science_Question.Test,-1);
                    Question_object.setHover_History(questions[i].Hover_History);

                    Question_object.Checked_Answers=questions[i].Checked_Answers[0].split(",");
                    Question_object.setCheckAnswer(questions[i].Check_Answer)
                    Question_object.setResponse(questions[i].Response);
                    Question_object.setRepeats(questions[i].Repeats);
                    Question_object.setHint_Selection(questions[i].Hint_Selection);
                    Question_object.setViews(questions[i].Views);
                    Question_object.setTotalTime(questions[i].Total_Time.toString());
                    Question_object.setTime(questions[i].Time);
                    Question_object.setTime_Stamp(questions[i].time_stamp)
                    Question_object.setConfidence(questions[i].Confidence)
                    keywords.push(Question_object)
                }
            }

        });
        this.Normal_History=keywords;



        this.List_Questions=keywords;
        console.log("Successfully recalled the Set of Questions "+this.Normal_History.length)
    }
    async getFinishedTest(test_package){
        var dict_schema_1 = {
            "ACT-Reading":"ReadingQuestion" ,
            "ACT-Math": "MathQuestion",
            "ACT-English": "EnglishQuestion",
            "ACT-Science":"ScienceQuestion"
        }///associations between the response and the original questions on seperate tables

        var test_list=test_package.split(" ");
        var temp_list=[]

        var temp_session=parseInt(test_list[2])
        this.Session=temp_session
        console.log("test package "+test_package)
        if(test_list[1].includes("Set")){//If the Tutor selects a Set of problems the Student did.
            await this.getFinishedTest_Set(test_list)
            return
        }
        async.waterfall(
            [
                await function(callback) {
                console.log("calllback "+test_list[1])

                dict[test_list[1]].find({ "Test":test_list[0]}).select("_id").exec(callback);
                    console.log("inside reading table");
                },
                await function(questions_1,callback) {

                    if  (test_list[1]=="ACT-English"){
                        Response_table.find({
                            "English_Question": { "$in": questions_1.map((current) => { return current._id }) },
                            "Session": temp_session,
                            "Model_Name": dict_schema_1[test_list[1]]
                    }).populate("English_Question").exec(callback);
                    }
                    else if(test_list[1]=="ACT-Reading"){

                        Response_table.find({
                            "Reading_Question": { "$in": questions_1.map((current) => { return current._id }) },
                            "Session": temp_session,
                            "Model_Name": dict_schema_1[test_list[1]]
                        }).populate("Reading_Question").exec(callback);
                    }
                    else if(test_list[1]=="ACT-Math"){
                        Response_table.find({
                            "Math_Question": { "$in": questions_1.map((current) => { return current._id }) },
                            "Session": temp_session,
                            "Model_Name": dict_schema_1[test_list[1]]
                        }).populate("Math_Question").exec(callback);
                    }
                    else if(test_list[1]=="ACT-Science"){
                        Response_table.find({
                            "Science_Question": { "$in": questions_1.map((current) => { return current._id }) },
                            "Session": temp_session,
                            "Model_Name": dict_schema_1[test_list[1]]
                        }).populate("Science_Question").exec(callback);
                    }

                }
            ],await function(err,questions) {
                // filter and populated

                var counter=0;
                if (questions.length==0){
                    console.log("thus student has no tests")
                    return ["NO QUESTIONS WERE FOUND TO MATCH"];
                }
                if(test_list[1]=="ACT-English"){
                    for(var i=0;i<questions.length;++i){

                        console.log("responses being returned English"+" "+questions[i].English_Question.Number+" "+questions[i].English_Question.Test+" "+questions[i].English_Question.Tag+" "+questions[i].English_Question.Right_Answer+" -->"+questions[i].Checked_Answers[0]);
                        var Question_object=new Question(" ",[" "],questions[i].English_Question.Right_Answer,questions[i].English_Question.Tag,questions[i].English_Question.Number,
                            " ",questions[i].English_Question.Test_Type,questions[i].English_Question.Test,-1);
                        Question_object.setHover_History(questions[i].Hover_History);
                        Question_object.setDraw_History(questions[i].Draw_History);
                        Question_object.Checked_Answers=questions[i].Checked_Answers[0].split(",");
                        Question_object.setCheckAnswer(questions[i].Check_Answer)
                        Question_object.setResponse(questions[i].Response);
                        Question_object.setRepeats(questions[i].Repeats);
                        Question_object.setHint_Selection(questions[i].Hint_Selection);
                        Question_object.setViews(questions[i].Views);
                        Question_object.setTotalTime(questions[i].Total_Time.toString());
                        Question_object.setTime(questions[i].Time);
                        Question_object.setTime_Stamp(questions[i].time_stamp)
                        Question_object.setConfidence(questions[i].Confidence)
                        temp_list[counter]=Question_object
                        ++counter;
                    }
                }
                else if(test_list[1]=="ACT-Reading"){

                    for(var i=0;i<questions.length;++i){
                        //console.log(  questions[i].Reading_Question)
                        console.log("responses being returned reading"+" "+questions[i].Reading_Question.Number+" "+questions[i].Reading_Question.Test+" "+questions[i].Reading_Question.Tag+" "+questions[i].Reading_Question.Right_Answer+" -->"+questions[i].Checked_Answers[0]);
                        var Question_object=new Question(" ",[" "],questions[i].Reading_Question.Right_Answer,questions[i].Reading_Question.Tag,questions[i].Reading_Question.Number,
                            " ",questions[i].Reading_Question.Test_Type,questions[i].Reading_Question.Test,-1);
                        Question_object.setHover_History(questions[i].Hover_History);
                        Question_object.setDraw_History(questions[i].Draw_History);
                        Question_object.Checked_Answers=questions[i].Checked_Answers[0].split(",");
                        Question_object.setCheckAnswer(questions[i].Check_Answer)
                        Question_object.setResponse(questions[i].Response);
                        Question_object.setRepeats(questions[i].Repeats);
                        Question_object.setHint_Selection(questions[i].Hint_Selection);
                        Question_object.setViews(questions[i].Views);
                        Question_object.setTotalTime(questions[i].Total_Time.toString());
                        Question_object.setTime(questions[i].Time);
                        Question_object.setTime_Stamp(questions[i].time_stamp)
                        Question_object.setConfidence(questions[i].Confidence)
                        temp_list[counter]=Question_object
                        ++counter;
                    }
                }
                else if(test_list[1]=="ACT-Math"){
                    for(var i=0;i<questions.length;++i){

                        console.log("responses being returned Math"+" "+questions[i].Math_Question.Number+" "+questions[i].Math_Question.Test+" "+questions[i].Math_Question.Tag+" "+questions[i].Math_Question.Right_Answer+" -->"+questions[i].Checked_Answers[0]);
                        var Question_object=new Question(" ",[" "],questions[i].Math_Question.Right_Answer,questions[i].Math_Question.Tag,questions[i].Math_Question.Number,
                            " ",questions[i].Math_Question.Test_Type,questions[i].Math_Question.Test,-1);
                        Question_object.setHover_History(questions[i].Hover_History);
                        Question_object.setDraw_History(questions[i].Draw_History);
                        Question_object.Checked_Answers=questions[i].Checked_Answers[0].split(",");
                        Question_object.setCheckAnswer(questions[i].Check_Answer)
                        Question_object.setResponse(questions[i].Response);
                        Question_object.setRepeats(questions[i].Repeats);
                        Question_object.setHint_Selection(questions[i].Hint_Selection);
                        Question_object.setViews(questions[i].Views);
                        Question_object.setTotalTime(questions[i].Total_Time.toString());
                        Question_object.setTime(questions[i].Time);
                        Question_object.setTime_Stamp(questions[i].time_stamp)
                        Question_object.setConfidence(questions[i].Confidence)
                        temp_list[counter]=Question_object
                        ++counter;
                    }
                }
                else if(test_list[1]=="ACT-Science"){
                    for(var i=0;i<questions.length;++i){

                        console.log("responses being returned Science"+" "+questions[i].Science_Question.Number+" "+questions[i].Science_Question.Test+" "+questions[i].Science_Question.Tag+" "+questions[i].Science_Question.Right_Answer+" -->"+questions[i].Checked_Answers[0]);
                        var Question_object=new Question(" ",[" "],questions[i].Science_Question.Right_Answer,questions[i].Science_Question.Tag,questions[i].Science_Question.Number,
                            " ",questions[i].Science_Question.Test_Type,questions[i].Science_Question.Test,-1);
                        Question_object.setDraw_History(questions[i].Draw_History);
                        Question_object.setHover_History(questions[i].Hover_History);
                        Question_object.Checked_Answers=questions[i].Checked_Answers[0].split(",");
                        Question_object.setCheckAnswer(questions[i].Check_Answer)
                        Question_object.setResponse(questions[i].Response);
                        Question_object.setRepeats(questions[i].Repeats);
                        Question_object.setHint_Selection(questions[i].Hint_Selection);
                        Question_object.setViews(questions[i].Views);
                        Question_object.setTotalTime(questions[i].Total_Time.toString());
                        Question_object.setTime(questions[i].Time);
                        Question_object.setTime_Stamp(questions[i].time_stamp)
                        Question_object.setConfidence(questions[i].Confidence)
                        temp_list[counter]=Question_object
                        ++counter;
                    }
                }
                console.log("inside length "+temp_list.length)
            })
        this.Normal_History=temp_list;
        this.Test=test_list[0]//in order for scaled_scores() function to work well.
        this.Test_Type=test_list[1];
        var temp_Object=dict[test_list[1]].find({Test: test_list[0],Test_Type: test_list[1]}).populate("Passage_ID").lean()
        var Question_object;
        var keywords=[]
        var counter=0;
        await temp_Object.exec(function(err,Questions) {

            for  (var i=0;i<Questions.length;++i){

                for(var j=0;j<Questions[i].Choices.length;++j){
                    Questions[i].Choices[j]=Questions[i].Choices[j].replace(/,/g, ' ');
                }
                //console.log("Questions also being returedn  "+Questions[i].Number+" "+Questions[i].Test_Type+" "+Questions[i].Test)
                Question_object=new Question(Questions[i].Question_body.join(" "),Questions[i].Choices,Questions[i].Right_Answer,Questions[i].Tag,Questions[i].Number,Questions[i].Passage_ID.Passage.join(' '),Questions[i].Test_Type,Questions[i].Test,Questions[i]._id)
                Question_object.setFirstHint(Questions[i].Hint_1);


                Question_object.setPresentation_Highlight(Questions[i].Presentation_Highlight)
                keywords[counter]=Question_object;
                //console.log("keywords "+counter)
                ++counter;
            }

        });

        this.List_Questions=keywords;
        this.orderNormal_List()

    }
    async SearchAllStudents(){
        var Name_list=[]
        await Student_table.find({}).then((artwork) => {
            if (artwork.length==0){
                console.log("no students found")


            }
            else{
               // console.log("Found Student in Table"+(artwork))
                for (var i=0;i<artwork.length;++i){
                    Name_list.push(artwork[i].lastName+" "+artwork[i].firstName+" "+artwork[i].email)
                }

            }



        })
       // console.log(Name_list)
        return Name_list.sort();
    }
    async SearchStudent_Tests(firstName,lastName,email){//returns all tests student has taken
        var ID= await this.getStudentID(firstName,lastName,email)
        var set = new Set();
        var dict_schema_1 = {
            "ACT-Reading":"ReadingQuestion" ,
            "ACT-Math": "MathQuestion",
            "ACT-English": "EnglishQuestion"
        }
        var temp_Object= Response_table.find({Student_ID:this.Student.ID}).populate("English_Question").populate("Reading_Question").populate("Math_Question").populate("Science_Question")
        //temp_Object.populate("Student_ID").lean()
        await temp_Object.exec(function(err,Responses){
            if (Response.length==0){

                return ["This Student had No Tests"];
            }
            for  (var i=0;i<Responses.length;++i){

                        if(Responses[i].Model_Name=="EnglishQuestion"){
                            console.log("Response ID_SearchTests "+Responses[i].English_Question.Test+" "+Responses[i].English_Question.Test_Type)
                            if(Responses[i].Session.includes("Set")){
                                set.add(Responses[i].English_Question.Test_Type.toString()+" "+Responses[i].Session);
                            }
                            else{
                                set.add(Responses[i].English_Question.Test.toString()+" "+Responses[i].English_Question.Test_Type.toString()+" "+Responses[i].Session);
                            }

                        }
                        else if(Responses[i].Model_Name=="ReadingQuestion"){
                            if(Responses[i].Session.includes("Set")){
                                set.add(Responses[i].Reading_Question.Test_Type.toString()+" "+Responses[i].Session);

                            }
                            else{
                                set.add(Responses[i].Reading_Question.Test.toString()+" "+Responses[i].Reading_Question.Test_Type.toString()+" "+Responses[i].Session);

                            }

                        }
                        else if(Responses[i].Model_Name=="MathQuestion"){
                            if(Responses[i].Session.includes("Set")){
                                set.add(Responses[i].Math_Question.Test_Type.toString()+" "+Responses[i].Session);

                            }
                            else{
                                set.add(Responses[i].Math_Question.Test.toString()+" "+Responses[i].Math_Question.Test_Type.toString()+" "+Responses[i].Session);

                            }
                        }
                        else if(Responses[i].Model_Name=="ScienceQuestion"){
                            if(Responses[i].Session.includes("Set")){
                                set.add(Responses[i].Science_Question.Test_Type.toString()+" "+Responses[i].Session);

                            }
                            else{
                                set.add(Responses[i].Science_Question.Test.toString()+" "+Responses[i].Science_Question.Test_Type.toString()+" "+Responses[i].Session);

                            }
                        }


                    //console.log("                             Question ID                  Student ID     Tag")
                    //console.log("REsponses returned "+Responses[i].modelId.Test.toString()+" "+Responses[i].modelId.Test_Type.toString()+" "+Responses[i].Session+" "+Responses[i].modelId._id+" "+Responses[i].Response)
            }

        });


        return Array.from(set);
    }
    async addNewStudent(firstName,lastname,email){
        firstName=firstName.toLowerCase()
        lastname=lastname.toLowerCase()
        email=email.toLowerCase()
        var _ID=-1;
        var _Session;
        await Student_table.findOne({lastName:lastname,firstName:firstName}).then((artwork) => {
            if (artwork==null){
                console.log("no student found, now adding")

                var newStudent = new Student_table({
                    firstName: firstName,
                    lastName: lastname,
                    email: email,
                    session:0

                });
                newStudent.save(function (err,id) {
                    if (err) return handleError(err);
                    console.log("Successfully saved student")
                    _ID=id;
                    _Session=0;
                })

            }

        })
        this.setStudent(new Student(firstName,lastname,email,_ID,_Session))
        return _ID
    }
    async getStudentID(firstName,lastname,email){

        var _ID=0;
        var _Session=0;
        email=email.toLowerCase();
        lastname=lastname.toLowerCase();
        firstName=firstName.toLowerCase();
        //First search if he's in there, if not, insert into Student SChema Tble and return newly ID
        await Student_table.findOne({lastName:lastname,firstName:firstName}).then((artwork) => {
            if (artwork==null){
                console.log("no student found")
                return;//We dont want to create a new student
                var newStudent = new Student_table({
                    firstName: firstName,
                    lastName: lastname,
                    email: email,
                    session:0

                });
                newStudent.save(function (err,id) {
                    if (err) return handleError(err);
                    console.log("Successfully saved student")
                    _ID=id;
                    _Session=0;
                })

            }
            else{
                console.log("Found Student in Table"+artwork.id+" "+artwork)
                _ID=artwork.id
                email=artwork.email
                firstName=artwork.firstName
                _Session=artwork.session+1
            }



        })
        if (_Session==0){
            console.log("returing false because no student found")
            return false;
        }
        console.log("Did session make it out? "+_Session+" "+email+" "+firstName )
        this.setStudent(new Student(firstName,lastname,email,_ID,_Session))
        if(_Session==0){
            this.send_email("registered")
        }
        await Student_table.update({"firstName":firstName,"lastName":lastname},
            {$set: { "session" : _Session}})


        return _ID

    }
   sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds){
                break;
            }
        }
    }
    DeleteQuestion(number, test_type, test) {

        console.log("inside delete question "+number+" "+test_type+" "+test);

        dict[test_type].findOneAndRemove({ Test: test,Number:number }, function (err) {  if(err) console.log(err);
            console.log("Successful deletion");});
        //Question_database.find({ }).remove().exec();
        // this.getNumberofQuestions();


    }

    ParseText(List){
        //console.log("Inside Parse Text"+List)
        var Temp=[[]];

        for (var i = 0; i < List.length; i++) {
            var object=[]
            //console.log("Parse Text"+" "+List[i].toString().replace(/(\r\n|\n|\r)/gm,""))
            var str=List[i].toString().replace(/(\r\n|\n|\r)/gm,"");
            object=str.split(" ")
            // console.log("OBject"+object)
            Temp[i]=object

        }
        //console.log("returning Parsed"+Temp)
        return Temp
    }

    async ReadIn(){
        console.log("Read in")
        const lineByLine = require('n-readlines');
        const liner = new lineByLine('C:\\Users\\david\\KrupnickQuestions.txt');
        var Answers=[]
        var test_number_list=[]
        //Body_List=ParseText([req.body.QuestionText,req.body.AnswerA,req.body.AnswerB,req.body.AnswerC,req.body.AnswerD,req.body.AnswerE,
            //req.body.Tag,req.body.Test.toString(),req.body.Test_Type.toString(),req.body.RightAnswer,req.body.Passage,req.body.Question_Number])
        var body_list=[]
        let line;
        var temp_Question_body
        var line_passage=""
        while (line=liner.next()) {

            if (line.includes("Going in")){
                var question_index=this.extractQuestion(line)
                body_list.push(this.Question_Body)
                var Tag_index=this.extractTag_Answer(line)
                line_passage=this.extractPassage(line,Tag_index);
                Answers=this.extractAnswers(question_index+1,Tag_index,line)

                while(line.indexOf("THIS IS THE QUESTION NUMBER")<0){

                    line=liner.next()

                    line_passage=line_passage+line
                    //console.log("passage...->"+" "+line_passage)
                }

                body_list.push(Answers[0],Answers[1],Answers[2],Answers[3],"")
                body_list.push(this.Tag)

            }
            if(line.includes("THIS IS THE QUESTION NUMBER")){

                test_number_list=this.extractTest_Number(line);
                body_list.push(test_number_list[2])
                body_list.push(test_number_list[1])
                body_list.push(this.Answer)
                //console.log("Passage going in"+line_passage)
                body_list.push(line_passage)
                body_list.push(test_number_list[0])
                for (var i=0;i<body_list.length;++i){
                    console.log("BODY LIST SO FAR"+" "+body_list[i])
                }

                var Body_List=this.ParseText(body_list)
                //await this.addNewQuestion(Body_List)
                line_passage=""
                body_list=[]

            }


        }
    }
    extractPassage(line,tag_index){
        var temp_index=line.indexOf("THIS IS THE PASSAGE")
        console.log("BEGINNING OF THE PASSAAGE"+" "+String(line).substr(temp_index+20))
        return String(line).substr(temp_index+20)
    }
    extractTest_Number(line){

        var temp_index=String(line).indexOf("NUMBER")

        //console.log("TEST AND NUMBER: "+" "+String(line).substr(temp_index+6).split(" "));
        var temp_string=String(line).substr(temp_index+6)
        var temp_list=temp_string.split(" ");
        temp_list.shift()
        console.log("TEST AND NUMBER: "+" "+temp_list);
        return temp_list

    }
    extractQuestion(line){
    var index=-1;
    if (line.indexOf('?') >0){
        index=line.indexOf('?')
    }
    else if(line.indexOf(':') >0){
        index=line.indexOf(':')
    }
    else if(line.indexOf(';')>0){
        index=line.indexOf(';')
    }


    if (index<0){
        console.log('NEVER FOUND A QUESTION_MARK OR COLON TO END THE QUESTION')
    }
    //console.log("Index where question ends"+" "+index)
    console.log("QUESTION BODY:"+" "+line.slice(8, index));
    this.Question_Body=line.slice(8, index)
    return index
}
    extractAnswers(question_index,tag_index,line){
        var temp_string=String(line).substr(question_index,tag_index);
        var temp_index=temp_string.indexOf("THIS IS THE PASSAGE")

        if (temp_index>0){
            var x=0;
            var period=-1
            while(period<0){
                period=temp_string.indexOf('.', temp_index-x);

                ++x;
            }


            console.log("ANSWER CHOICES: "+String(line).substr(question_index,temp_index-x+1).split("."))

            return String(line).substr(question_index,temp_index-x+1).split(".");

        }

    }
    extractTag_Answer(line){
        //console.log("inside extractTag Answer"+" "+line)
        var index=line.indexOf("THIS IS")
        if (index>0){
            var x=0;
            var period=-1
            while(period<0){
                period=line.indexOf('.', index-x);
                ++x
            }
            var temp_string=String(line).substr(index-x+1,index);
            var temp_index=temp_string.indexOf("THIS IS THE PASSAGE")

            temp_string=String(line).substr(index-x+1,temp_index);
            var temp_list=temp_string.split(" ")

            temp_list.pop()
            this.Answer=temp_list.pop()
            this.Tag=temp_list.join(" ")
            console.log("THIS IS ANSWER: "+this.Answer);
            console.log("THIS IS TAG"+" "+this.Tag)

            //console.log("This is the Tag and others: "+String(line).substr(index-x+1,index))
            return index-x+1 //first period detected so this index should signify the end of Question Choices.
    }


    }

    getRawScore(){//This function should only be called at the end
        var wrong_count=0;
        var questions_answered=[];
        for  (var i=0;i< this.Normal_History.length;++i) {

                if (this.Normal_History[i].Response != this.Normal_History[i].Right_Answer) {
                    console.log("got it wrong "+this.Normal_History[i].Number+this.Normal_History[i].Response+" "+this.Normal_History[i].Right_Answer )
                    ++wrong_count;
                }

            questions_answered.push(this.Normal_History[i].Number);
        }
        for (var i=0;i<this.List_Questions.length;++i){

           // console.log("questions answered "+questions_answered)

            if (questions_answered.indexOf(this.List_Questions[i].Number)>=0){
               // console.log("He did answer this question" + this.List_Questions[i].Number)
            }
            else{
               //console.log("NEver answered "+this.List_Questions[i].Number)
                ++wrong_count;
            }

        }
        console.log("Total Wrong "+wrong_count)
        return this.List_Questions.length-wrong_count;
    }
    fillArrayWithNumbers(n) {
        var arr = Array.apply(null, Array(n));
        return arr.map(function (x, i) { return i });
    }
    async DisplayResults_Problem_Set(){
        var temp_List=[];
        var questions_answered=[];
        for  (var i=0;i<this.Normal_History.length;++i){

            if ( this.Normal_History[i].Response != this.Normal_History[i].Right_Answer ){
                var temp=this.Normal_History[i].Number+";"+this.Normal_History[i].Test_Type+";"+this.Normal_History[i].Test+";"+this.Normal_History[i].Time+";"+
                    this.Normal_History[i].Tag.replace(",","-").replace(",","-")+";"+ this.Normal_History[i].Hint_Selection+";"+this.Normal_History[i].Check_Answer+";"+this.Normal_History[i].Response+";"+this.Normal_History[i].Right_Answer+";"+(this.Normal_History[i].Repeats-1)+";"+this.Normal_History[i].Views;
                //temp_list.push(temp);
                console.log("Displaying Results Got it Wrong_Problem Set "+temp)
                temp_List.push(temp)
                //console.log("temp_list so far "+temp_list)
                this.List_Questions[i].Response=this.Normal_History[i].Response
            }
            else{
                var temp=this.Normal_History[i].Number+";"+this.Normal_History[i].Test_Type+";"+this.Normal_History[i].Test+";"+this.Normal_History[i].Time+";"+
                    this.Normal_History[i].Tag.replace(",","-").replace(",","-")+";"+ this.Normal_History[i].Hint_Selection+";"+this.Normal_History[i].Check_Answer+";"+this.Normal_History[i].Response+";"+this.Normal_History[i].Right_Answer+";"+(this.Normal_History[i].Repeats-1)+";"+this.Normal_History[i].Views;
                //temp_list.push(temp);
                console.log("Displaying Results Got it Right_Problem Set "+temp)
                temp_List.push(temp)
                //console.log("temp_list so far "+temp_list)
                this.List_Questions[i].Response=this.Normal_History[i].Response
            }
            //console.log("temp_list so far: "+temp_list)
            questions_answered.push(i);

        }
        for (var i=0;i<this.List_Questions.length;++i){
            if (questions_answered.indexOf(i)>=0){
                // console.log("He did answer this question " +this.List_Questions[i].Number )

            }
            else{
                //console.log("Never answered "+this.List_Questions[i].Number)
                var temp=this.List_Questions[i].Number+";"+this.List_Questions[i].Test_Type+";"+this.List_Questions[i].Test+";"+"NEVER ANSWERED"+";"+"NEVER ANSWERED"+";"+"NEVER ANSWERED"+";"+this.List_Questions[i].Views;
                //temp_list.push(temp);
                temp_List.push(temp)
                console.log("Never Answered regular_Problem Set "+temp)
            }

        }
        return temp_List;
    }
    async DisplayResultList(score){


        var temp_list=[]
        if(this.Test_Type=="ACT-Reading"){
            temp_list=this.fillArrayWithNumbers(40)
        }
       else if(this.Test_Type=="ACT-English"){
            temp_list=this.fillArrayWithNumbers(75)
        }
       else if(this.Test_Type=="ACT-Math"){
            temp_list=this.fillArrayWithNumbers(60)
        }
       else if(this.Test_Type =="ACT-Science"){
            temp_list=this.fillArrayWithNumbers(40)
        }
        if(score<0){
            return this.DisplayResults_Problem_Set(temp_list);///Becauase its actually a problem set, not a normal test so the below algo wont work for it
        }
        //temp_list.push("Number"+" "+"Test_Type"+" "+"Test"+" "+"Time            "+        "Hint: ")
        var questions_answered=[];
        for  (var i=0;i<this.Normal_History.length;++i){

                if ( this.Normal_History[i].Response != this.Normal_History[i].Right_Answer ){
                    var temp=this.Normal_History[i].Number+";"+this.Normal_History[i].Test_Type+";"+this.Normal_History[i].Test+";"+this.Normal_History[i].Time+";"+
                        this.Normal_History[i].Tag.replace(",","-").replace(",","-")+";"+ this.Normal_History[i].Hint_Selection+";"+this.Normal_History[i].Check_Answer+";"+this.Normal_History[i].Response+";"+this.Normal_History[i].Right_Answer+";"+(this.Normal_History[i].Repeats-1)+";"+this.Normal_History[i].Views;
                    //temp_list.push(temp);
                    console.log("Displaying Results Got it Wrong "+temp)
                    temp_list.splice(parseInt(this.Normal_History[i].Number)-1, 1, temp)
                    //console.log("temp_list so far "+temp_list)
                    this.List_Questions[this.Normal_History[i].Number-1].Response=this.Normal_History[i].Response
                }
                else{
                    var temp=this.Normal_History[i].Number+";"+this.Normal_History[i].Test_Type+";"+this.Normal_History[i].Test+";"+this.Normal_History[i].Time+";"+
                        this.Normal_History[i].Tag.replace(",","-").replace(",","-")+";"+ this.Normal_History[i].Hint_Selection+";"+this.Normal_History[i].Check_Answer+";"+this.Normal_History[i].Response+";"+this.Normal_History[i].Right_Answer+";"+(this.Normal_History[i].Repeats-1)+";"+this.Normal_History[i].Views;
                    //temp_list.push(temp);
                    console.log("Displaying Results Got it Right "+temp)
                    temp_list.splice(parseInt(this.Normal_History[i].Number)-1, 1, temp)
                    //console.log("temp_list so far "+temp_list)
                    this.List_Questions[this.Normal_History[i].Number-1].Response=this.Normal_History[i].Response
                }
              //console.log("temp_list so far: "+temp_list)
            questions_answered.push(this.Normal_History[i].Number);

        }
        for (var i=0;i<this.List_Questions.length;++i){
            if (questions_answered.indexOf(this.List_Questions[i].Number)>=0){
               // console.log("He did answer this question " +this.List_Questions[i].Number )

            }
            else{
                //console.log("Never answered "+this.List_Questions[i].Number)
                var temp=this.List_Questions[i].Number+";"+this.List_Questions[i].Test_Type+";"+this.List_Questions[i].Test+";"+"NEVER ANSWERED"+";"+"NEVER ANSWERED"+";"+"NEVER ANSWERED"+";"+this.List_Questions[i].Views;
                //temp_list.push(temp);
                temp_list.splice(parseInt(this.List_Questions[i].Number)-1, 1, temp)
                //console.log("Never Answered regular "+temp)
            }

        }
        return temp_list;

    }
    DisplayResult_Tutor_View_Set(){//tutor views the set of problems
        var temp_list=[]
        for  (var i=0;i<this.Normal_History.length;++i){

            if ( this.Normal_History[i].Response != this.Normal_History[i].Right_Answer ){
                console.log("tag replace "+this.Normal_History[i].Tag.replace(",","-").replace(",","-"))
                var temp=this.Normal_History[i].Number+";"+this.Normal_History[i].Test_Type+";"+this.Normal_History[i].Test+";"+this.Normal_History[i].Time+";"+
                    this.Normal_History[i].Tag.replace(",","-").replace(",","-")+";"+ this.Normal_History[i].Hint_Selection+";"+this.Normal_History[i].Check_Answer+";"+this.Normal_History[i].Response+";"+this.Normal_History[i].Right_Answer+";"+(this.Normal_History[i].Repeats-1)+";"+this.Normal_History[i].Views+
                    ";"+this.Normal_History[i].Time_Stamp+";"+this.Normal_History[i].Hover_History[0].split(',').join("/")+";"+this.Normal_History[i].Confidence+";"+this.Normal_History[i].Checked_Answers.join("/")
                //temp_list.push(temp);
                console.log("Displaying Results Got it Wrong_Tutor_Set "+temp)
                temp_list.push(temp)
               // this.List_Questions[i].Response=this.Normal_History[i].Response
               // this.List_Questions[i].Confidence=this.Normal_History[i].Confidence
            }
            else{
                //console.log("Displaying Results Got it Right_Tutor_Set "+ this.Normal_History[i].Tag+" "+ this.Normal_History[i].Number+" "+this.Normal_History[i].Test)
                var temp=this.Normal_History[i].Number+";"+this.Normal_History[i].Test_Type+";"+this.Normal_History[i].Test+";"+this.Normal_History[i].Time+";"+
                    this.Normal_History[i].Tag.replace(",","-").replace(",","-")+";"+ this.Normal_History[i].Hint_Selection+";"+this.Normal_History[i].Check_Answer+";"+this.Normal_History[i].Response+";"+this.Normal_History[i].Right_Answer+";"+(this.Normal_History[i].Repeats-1)+";"+this.Normal_History[i].Views+
                    ";"+this.Normal_History[i].Time_Stamp+";"+this.Normal_History[i].Hover_History[0].split(',').join("/")+";"+this.Normal_History[i].Confidence+";"+this.Normal_History[i].Checked_Answers.join("/")
                //temp_list.push(temp);
                console.log("Displaying Results Got it Right_Tutor_Set "+temp);
                temp_list.push(temp)
               // this.List_Questions[i].Response=this.Normal_History[i].Response
                //this.List_Questions[i].Confidence=this.Normal_History[i].Confidence
            }
            //console.log("temp_list so far: "+temp_list)


        }
        return temp_list
    }
    async DisplayResultList_Tutor_View(scaled){

        var temp_list=[]

        //temp_list.push("Number"+" "+"Test_Type"+" "+"Test"+" "+"Time            "+        "Hint: ")

        if (scaled<0){

            return this.DisplayResult_Tutor_View_Set();
        }
        console.log("length of Normal History "+this.Normal_History.length)
        var questions_answered=[];
        for  (var i=0;i<this.Normal_History.length;++i){

            if ( this.Normal_History[i].Response != this.Normal_History[i].Right_Answer ){
                console.log("tag replace "+this.Normal_History[i].Hover_History[0]+" ")
                var temp=this.Normal_History[i].Number+";"+this.Normal_History[i].Test_Type+";"+this.Normal_History[i].Test+";"+this.Normal_History[i].Time+";"+
                    this.Normal_History[i].Tag.replace(",","-").replace(",","-")+";"+ this.Normal_History[i].Hint_Selection+";"+this.Normal_History[i].Check_Answer+";"+this.Normal_History[i].Response+";"+this.Normal_History[i].Right_Answer+";"+(this.Normal_History[i].Repeats-1)+";"+this.Normal_History[i].Views+
                    ";"+this.Normal_History[i].Time_Stamp+";"+this.Normal_History[i].Hover_History[0].split(',').join("/")+";"+this.Normal_History[i].Confidence+";"+this.Normal_History[i].Checked_Answers.join("/")
                //temp_list.push(temp);
                console.log("Displaying Results Got it Wrong_Tutor "+temp)
                temp_list.push(temp)
                this.List_Questions[this.Normal_History[i].Number-1].Response=this.Normal_History[i].Response
                this.List_Questions[this.Normal_History[i].Number-1].Confidence=this.Normal_History[i].Confidence
            }
            else{
                console.log("Displaying Results Got it Right_Tutor "+ this.Normal_History[i].Tag+" "+ this.Normal_History[i].Number+" "+this.Normal_History[i].Test)
                console.log("tag replace "+this.Normal_History[i].Hover_History)
                var temp=this.Normal_History[i].Number+";"+this.Normal_History[i].Test_Type+";"+this.Normal_History[i].Test+";"+this.Normal_History[i].Time+";"+
                    this.Normal_History[i].Tag.replace(",","-").replace(",","-")+";"+ this.Normal_History[i].Hint_Selection+";"+this.Normal_History[i].Check_Answer+";"+this.Normal_History[i].Response+";"+this.Normal_History[i].Right_Answer+";"+(this.Normal_History[i].Repeats-1)+";"+this.Normal_History[i].Views+
                    ";"+this.Normal_History[i].Time_Stamp+";"+this.Normal_History[i].Hover_History[0].split(',').join("/")+";"+this.Normal_History[i].Confidence+";"+this.Normal_History[i].Checked_Answers.join("/")
                //temp_list.push(temp);
                console.log("Displaying Results Got it Right_Tutor "+temp);
                temp_list.push(temp)
                this.List_Questions[this.Normal_History[i].Number-1].Response=this.Normal_History[i].Response
                this.List_Questions[this.Normal_History[i].Number-1].Confidence=this.Normal_History[i].Confidence
            }
            //console.log("temp_list so far: "+temp_list)
            questions_answered.push(this.Normal_History[i].Number);

        }
        this.Total_Time_Display=this.Normal_History[this.Normal_History.length-1].Total_Time;

        for (var i=0;i<this.List_Questions.length;++i){
            if (questions_answered.indexOf(this.List_Questions[i].Number)>=0){
                // console.log("He did answer this question " +this.List_Questions[i].Number )

            }
            else{
                //console.log("Never answered "+this.List_Questions[i].Number)
                var temp=this.List_Questions[i].Number+";"+this.List_Questions[i].Test_Type+";"+this.List_Questions[i].Test+";"+"NEVER ANSWERED"+";"+"NEVER ANSWERED"+";"+"NEVER ANSWERED"+";"+this.List_Questions[i].Check_Answer+";"+"Never Answered"+";"+this.List_Questions[i].Right_Answer+";"+ (this.List_Questions[i].Repeats-1)+";"+"Never Answered"+";"+"Never Answered"+";"+"Never/Answered";

                temp_list.push(temp)
                //console.log("Never Answered_tutor_view "+temp)
            }

        }

        return temp_list;
    }
    DisplayQuestionsList(){
        var temp="This is just a Sample Question, go to the Next Question to begin Test"+"\n"
        for (var i=0; i<this.List_Questions.length;++i){
            temp=temp+"Test: "+this.List_Questions[i].getTest().toString()+" "+ "number: "+" " +this.List_Questions[i].getNumber()+"\n"


            //console.log("list display "+ this.List_Questions[i].getNumber())
        }
        //console.log("dispalying the sample "+temp)
        return temp
    }
    DisplayWeaknessList(){
        var temp=""
        for (var i=0; i<this.List_WeaknessQuestions.length;++i){
            temp=temp+"Test: "+this.List_WeaknessQuestions[i].getTest().toString()+" "+ "number: "+" " +this.List_WeaknessQuestions[i].getNumber()+"\n";


            //console.log("tagged list display "+ temp_list[i])
        }

        return temp
    }
    DisplayTaggedList(){
        var temp_list=[];
        for (var i=0; i<this.List_TaggedQuestions.length;++i){
            var tuple="Test: "+this.List_TaggedQuestions[i].getTest().toString()+" "+ "number: "+" " +this.List_TaggedQuestions[i].getNumber();

            temp_list.push(tuple);
            //console.log("tagged list display "+ temp_list[i])
        }

        return temp_list
    }
}