var mongoose = require('mongoose');
const async = require('async');

const Reading_table=mongoose.model('ReadingQuestion')
const Math_table=mongoose.model('MathQuestion')
const English_table=mongoose.model('EnglishQuestion')
const Passage_table=mongoose.model('Passage')
var Response_table=mongoose.model('Response')
var Student_table=mongoose.model('Student')
var dict;
var dict = {
    "ACT-Reading": Reading_table,
    "ACT-Math": Math_table,
    "ACT-English": English_table
    // etc.
};

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

            this.List_WeaknessQuestions=[];
            this.List_Weakness_History=[];
            this.Count=0;
            this.Last_Question;
            this.Last_Tagged_Question;
            this.Student=null;
            this.Test_Type=Test_Type
            this.Test;
            this.Question_Time_Limit;
            this.Test_Time_Limit;
            this.Test_Time_Current;
            this.CheckBox_List=option_list.join(" ")
        }
        else if(Test!=null){
            this.database_index=index  ;
            console.log('inside Database COnstructor')
            this.List_Questions=[];
            this.Normal_Index=null;
            this.List_TaggedQuestions=[];
            this.List_Tagged_History=[];
            this.Time_Limit;
            this.Normal_History=[]
            this.List_DifficultyQuestions=[]

            this.List_WeaknessQuestions=[];
            this.List_Weakness_History=[];
            this.Count=0;
            this.Last_Question;
            this.Last_Tagged_Question;
            this.Student=null;
            this.Test_Type=Test_Type;
            this.Test=Test;
            this.Question_Time_Limit;
            this.Test_Time_Limit;
            this.Test_Time_Current;
            this.CheckBox_List=option_list.join(" ")



            ////below are just temp for reading it reading questi  ons
            this.Answer="";
            this.Tag="";
            this.Question_Body=""
        } //If the Constructor that carries a lot is to be called
        else{
            this.database_index ;
           // console.log('inside Database COnstructor-->Consturcting Weakness Database')
            this.List_Questions=[];
            this.Normal_Index=null;
            this.List_TaggedQuestions=[];
            this.List_Tagged_History=[];

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
        }//The constructor to form Weakness Questions


    }
    setTimeLimit(question_time_limit,test_time_limit ){
        this.Question_Time_Limit=question_time_limit;
        if (test_time_limit.length==0){
            this.Test_Time_Limit=0;
        }

        console.log("Setting time"+question_time_limit+" "+test_time_limit)
    }
    updateCurrentTime(timer){
        this.Test_Time_Current=timer;
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
                console.log("inside negative")
                this.Test_Time_Current=0;
                clearInterval(interval);

            }


            //minutes = (minutes < 10) ?  minutes : minutes;

            timer2 = minutes.toString() + ':' + seconds.toString();
            //console.log("timer2 "+timer2)
        }, 1000);


    }
    // Adding a method to the constructor
    getTest_Time_Current(){
        if (this.Test_Time_Current==0){
            console.log("Test Time is nullified")
            return ""
        }
        return this.Test_Time_Current
    }
   async InitializeQuestions(){
        await this.initializeNormal_List()
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
    }
    async initialize_Tag_history(){
        console.log("initialize Tag History")
        var Question_object=null;
        var keywords = [];
        var counter=0;

        var temp_Object= Response_table.find({Student_ID:this.Student.ID}).populate("modelId")
        temp_Object.populate("Student_ID").lean()
        var temp_Tag=this.Last_Question.Tag
        await temp_Object.exec(function(err,Responses){
            if (Response.length==0){
                this.List_Tagged_History=[];
                return;
            }
            for  (var i=0;i<Responses.length;++i){

                if(Responses[i].modelId.Tag==temp_Tag){
                    //console.log("                             Question ID                  Student ID     Tag")
                    //console.log("REsponses returned--Tag History"+" "+" "+Responses[i].modelId._id+" "+Responses[i].Student_ID._id+" "+Responses[i].modelId.Tag)
                    keywords[counter]=Responses[i].modelId._id.toString();
                    ++counter;
                }

            }

        });
        this.List_Tagged_History=keywords;
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

                for(var j=0;j<Questions[i].Choices.length;++j){
                        Questions[i].Choices[j]=Questions[i].Choices[j].replace(/,/g, ' ');
                }

                Question_object=new Question(Questions[i].Question_body.join(" "),Questions[i].Choices,Questions[i].Right_Answer,Questions[i].Tag,Questions[i].Number,Questions[i].Passage_ID.Passage.join(' '),Questions[i].Test_Type,Questions[i].Test,Questions[i]._id)
                Question_object.setFirstHint(Questions[i].Hint_1);
                Question_object.setPresentation_Highlight(Questions[i].Presentation_Highlight)
                keywords[counter]=Question_object;
                ++counter;
            }

        });

        this.List_Questions=keywords;
        console.log("List of normal questions"+" "+this.List_Questions.length)



    }
    async initializeTagged_List(){
        console.log("initializing Tagged_List")

        var keywords = [];
        var temp_History_List=this.List_Tagged_History;
        console.log("Tag its looking for "+" "+this.Last_Question.Tag)
        var last_question_id=this.Last_Question._id

        await dict[this.Test_Type].find({Tag:this.Last_Question.Tag}).populate("Passage_ID").lean().exec(function(err,Questions){

            var counter=0;
            var Question_object=null;

                for  (var i=0;i<Questions.length;++i){
                    if(temp_History_List.indexOf(Questions[i]._id.toString())==-1 && Questions[i]._id.toString() !=last_question_id.toString() ){

                        for(var j=0;j<Questions[i].Choices.length;++j){
                            Questions[i].Choices[j]=Questions[i].Choices[j].replace(/,/g, ' ');
                        }
                        Question_object=new Question(Questions[i].Question_body.join(" "),Questions[i].Choices,Questions[i].Right_Answer,Questions[i].Tag,Questions[i].Number,Questions[i].Passage_ID.Passage.join(' '),Questions[i].Test_Type,Questions[i].Test,Questions[i]._id)
                        Question_object.setFirstHint(Questions[i].Hint_1);
                        Question_object.setPresentation_Highlight(Questions[i].Presentation_Highlight)
                        keywords[counter]=Question_object;
                        ++counter;
                        //console.log("counter"+" "+counter+" "+keywords.length);
                    }

                }



        });
        this.List_TaggedQuestions=keywords;
        console.log("Size of List Tagged Quesstion"+this.List_TaggedQuestions.length);
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

   async getNextQuestion(current_index){
        console.log("Inside Get ORdered Question_Test TYpe(), Database.js",this.Test," ",this.Test_Type)
       if (current_index>=this.List_Questions.length){
           console.log("Youve reached the end of the line!");
            return false;
       }
        ++this.Count;
        var Choice_List=[]
        //populate difficulty list (if any change in difficulty occured)
        var keywords=[];

        //console.log("Length of Normal History"+" "+this.Normal_History.length);
        console.log("current"+" "+current_index);
        this.Last_Question=this.List_Questions[current_index];
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

       temp_Object= dict[Test_Type].findOne({Test:Test,Number:number}).populate("Passage_ID").lean()
        await temp_Object.exec(function(err,Question_re) {
                console.log("INside find One()"+Question_re)
                if (Question_re==null){
                    return 0;
                }
                for(var j=0;j<Question_re.Choices.length;++j){
                    Question_re.Choices[j]=Question_re.Choices[j].replace(/,/g, ' ');
                }

                Question_object=new Question(Question_re.Question_body.join(" "),Question_re.Choices,Question_re.Right_Answer,Question_re.Tag,Question_re.Number,Question_re.Passage_ID.Passage.join(' '),Question_re.Test_Type,Question_re.Test,Question_re._id)
                               // new Question(Questions[i].Question_body.join(" "),Questions[i].Choices,Questions[i].Right_Answer,Questions[i].Tag,Questions[i].Number,Questions[i].Passage_ID.Passage.join(' '),Questions[i].Test_Type,Questions[i].Test,Questions[i]._id)
                Question_object.setFirstHint(Question_re.Hint_1);

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
        while(temp_list.length<6){

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
        console.log("Long Word List"+" "+temp_list)
        console.log("Long Word List"+" "+temp_list2)
        if (count>3){
            console.log("Same passage")

            return true;
        }
        return false;


    }
    async addNewQuestion(BodyList){
        //console.log("Inside adding new Question in Database: Passage-->"+" "+BodyList[10]+"Question Body"+BodyList[0]+"Tag::  "+BodyList[6].join(" "))
        var newQuestion;
        var newPassage;
        var Object_ID=-1;
        var global=true;


        var temp_objects=await Passage_table.find({});
        console.log("length of passages being returned"+" "+temp_objects.length)
        //Checks to see if the new Passage exists already in the database
        for(var i=0;i<temp_objects.length;++i){
            //console.log("Passage being returned" + " " + temp_objects[i].Passage
            console.log("Passage BEING COMPARED" + " " + BodyList[10])
            if(this.comparePassages(temp_objects[i].Passage,BodyList[10])){
                console.log("Passage already in database" + " " +temp_objects[i].id);
                Object_ID=temp_objects[i].id
                global=false;
                break;
            }

        }
        if(global){
            newPassage = new Passage_table({
                Passage: BodyList[10],
                Picture_Path: ""
            });
            await newPassage.save(function (err, object) {
                if (err) {
                    console.log("Error caough_passage" + err.toString())
                }

                console.log("New Passage_ID" + " " + object.id)
                Object_ID = object.id;

            });
        }

        if(await this.SearchQuestion("",BodyList[11][0],BodyList[8][0],BodyList[7][0])==1){
            console.log("Question Already exists in database so only editing")
            await this.EditQuestion(BodyList)
            return;
        }

        console.log("inside inside"+" "+BodyList[12])
        console.log("inside inside"+" "+BodyList[13])

        newQuestion = new dict[BodyList[8][0]]({
            Question_body: BodyList[0],
            Passage_ID:Object_ID,
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
    async EditQuestion(BodyList){

        console.log("inside Edit Question"+" "+ BodyList[BodyList.length-1])
        await dict[BodyList[8][0]].update(
            { "Test" : BodyList[7][0],"Test_Type": BodyList[8][0],"Number":BodyList[11][0].toString() },
            { $set: { "Hint_1" : BodyList[BodyList.length-1],"Presentation_Highlight": BodyList[13]}
            }
        )
    }
    async saveResponse(response,time,First_Hint_holder,check_answer){
        console.log("saving response "+response+" "+time+" "+check_answer)
        var dict_schema = {
            "ACT-Reading":"ReadingQuestion" ,
            "ACT-Math": "MathQuestion",
            "ACT-English": "EnglishQuestion"
        }///associations between the response and the original questions on seperate tables
        var Object_ID;
        if (response==undefined){
            console.log("Not saving")
            return;
        }
        this.List_Tagged_History.push(this.Last_Question._id.toString());
        this.Last_Question.setResponse(response)

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



        console.log("Going in saving"+" "+response+" "+this.Student.ID+" "+this.Last_Question._id+" "+"CheckAnswers"+this.Last_Question.Check_Answer+" "+"Hint Selected?");
        var newReponse = new Response_table({
            Response:response,
            Student_ID:this.Student.ID,
            modelId:this.Last_Question._id,
            modelName_1:dict_schema[this.Test_Type],
            Time:this.Last_Question.getTime(),
            Hint_Selection:hint,
            Check_Answer:this.Last_Question.Check_Answer
        });
        await newReponse.save(function(err,object){
            if (err) {
                console.log("Error caough"+err.toString())
            }

            Object_ID=object.id;

        });
        console.log("Response ID"+" "+Object_ID)
        //also add the question to the Historical questions list maitained at this object

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
    async getStudentID(firstName,lastName,email){

        var _ID=0;
        //First search if he's in there, if not, insert into Student SChema Tble and return newly ID
        await Student_table.findOne({email:email }).then((artwork) => {
            console.log("Found Student in Table"+artwork.id)
            _ID=artwork.id

            if (_ID==0){//Than its a new student
                var newStudent = new Student_table({
                    firstName: firsName,
                    lastName: lastName,
                    email: email,

                });
               newStudent.save(function (err,id) {
                    if (err) return handleError(err);
                    console.log("Successfully saved student")
                    _ID=id;
                })
            }


        })

        this.setStudent(new Student(firstName,lastName,email,_ID))

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
    DeleteEntries() {


        Question_database.find({ }).remove().exec();
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
    async DisplayResultList(){

        var temp_list=[]
        temp_list.push("Number"+" "+"Test_Type"+" "+"Test"+" "+"Response"+" "+"Right Answer")

        for  (var i=0;i<this.Normal_History.length;++i){

            console.log("REsponses returned"+" "+" "+this.Normal_History[i].Number+" "+this.Normal_History[i].Test_Type+"   "+this.Normal_History[i].Response+" "+this.Normal_History[i].Right_Answer)
            if ( this.Normal_History[i].Response != this.Normal_History[i].Right_Answer ){
                var temp=this.Normal_History[i].Number+" "+this.Normal_History[i].Test_Type+"         "+this.Normal_History[i].Test+"         "  +this.Normal_History[i].Response+"         "+this.Normal_History[i].Right_Answer
                temp_list.push(temp);
            }
        }


        return temp_list;

    }
    DisplayQuestionsList(){
        var temp=""
        for (var i=0; i<this.List_Questions.length;++i){
            temp=temp+"Test: "+this.List_Questions[i].getTest().toString()+" "+ "number: "+" " +this.List_Questions[i].getNumber()+"\n"


            //console.log("list display "+ this.List_Questions[i].getNumber())
        }

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