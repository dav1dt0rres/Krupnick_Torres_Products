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

const StudentSchema = mongoose.model('Student');
const SessionSchema=mongoose.model('Session')


const Question = require('./Question.js');
const Math_Question = require('./Math_Question.js')

module.exports= class Database {

    constructor(Test_Type,Test_Number,index) {//This is Reproducible
        this.database_index=index  ;
        console.log('inside Database COnstructor')
        this.List_Questions=[];
        this.List_TaggedQuestions=[];
        this.List_DifficultyQuestions=[]
        this.List_WeaknessQuestions=[];
        this.Last_Question;
        this.Student=null;
        this.Test_Type=Test_Type;
        this.Test=Test_Number;

    }

    // Adding a method to the constructor
    InitializeQuestions(){
        this.initializeNormal_List()
        this.orderNormal_List()
        //populate the Tag list with new tag (if any changed occured)

    }
    orderTagged_List(){
        this.List_TaggedQuestions.sort((a, b) => (a.Number > b.Number) ? 1 : -1)
    }
    orderNormal_List(){
        this.List_Questions.sort((a, b) => (a.Number > b.Number) ? 1 : -1)
    }
    async initializeNormal_List(){
        //This is important and other Normal_List functions are also important because they only refer to when
        //the user selects to do A SINGLE TYPE OF TEST e.g. (READING-74G), this shouldnt be called for any other mode.
        console.log("initializing Normal_List")
        var Question_object=null;
        var keywords = [];
        var counter=0;
        var temp_Object= dict[this.Test_Type].find({Test:this.Test,Test_Type:this.Test_Type}).populate("Passage_ID").lean()
        await temp_Object.exec(function(err,Questions) {
            //console.log("length of list"+" "+Questions);
            for  (var i=0;i<Questions.length;++i){

                for(var j=0;j<Questions[i].Choices.length;++j){
                        Questions[i].Choices[j]=Questions[i].Choices[j].replace(/,/g, ' ');
                }
                Question_object=new Question(Questions[i].Question_body.join(" "),Questions[i].Choices,Questions[i].Right_Answer,Questions[i].Tag,Questions[i].Number,Questions[i].Passage_ID.Passage,Questions[i].Test_Type,Questions[i].Test,Questions[i]._id)

                keywords[counter]=Question_object;
                ++counter;
            }

        });

        this.List_Questions=keywords;
        this.Last_Question=this.List_Questions[this.List_Questions.length-1]
        console.log("Existing the normal list initalziation")
    }
    initializeTagged_List(){
        console.log("initializing Tagged_List")

        var keywords = [];
        dict[this.Test_Type].find({Tag:this.Last_Question.Tag}).populate("Passage_ID").lean().exec(function(err,Questions){

            var counter=0;
            var Question_object=null;

            for  (var i=0;i<Questions.length;++i){

                console.log("Tag being returned: "+Questions[i].Tag+" "+"Test being returned"+" "+Questions[i].Test);
                for(var j=0;j<Questions[i].Choices.length;++j){
                    Questions[i].Choices[j]=Questions[i].Choices[j].replace(/,/g, ' ');
                }
                Question_object=new Question(Questions[i].Question_body.join(" "),Questions[i].Choices,Questions[i].Right_Answer,Questions[i].Tag,Questions[i].Number,Questions[i].Passage_ID.Passage,Questions[i].Test_Type,Questions[i].Test,Questions[i]._id)
                keywords[counter]=Question_object;
                ++counter;
                console.log("counter"+" "+counter+" "+keywords.length);
            }

        });
        this.List_TaggedQuestions=keywords;
        //console.log("Size of List Tagged Quesstion"+this.List_TaggedQuestions.length);
    }
    initializeDifficulty_List(){
        console.log("initialize Diffuclt list")
        return};



    async getSame_TagQuestion(){
        console.log("Inside getSame_TagQuestion() Database.js"+" "+this.List_TaggedQuestions.length)
        var Choice_List=[]

        if(this.List_TaggedQuestions.length<=2){
            var keywords = [];
            console.log('Replenshing Tagged List'+" "+this.Last_Question.Tag)

            var temp_object=dict[this.Test_Type].find({Tag:this.Last_Question.Tag}).populate("Passage_ID").lean()
            await temp_object.exec(function(err,Questions){

                var counter=0;
                var Question_object=null;
                // console.log("Table"+artworks)

                for  (var i=0;i<Questions.length;++i){

                    console.log("Tag being returned: "+Questions[i].Tag+" "+"Test being returned"+" "+Questions[i].Test);
                    for(var j=0;j<Questions[i].Choices.length;++j){
                        Questions[i].Choices[j]=Questions[i].Choices[j].replace(/,/g, ' ');
                    }
                    console.log("passage being returned"+" "+Questions[i].Passage)
                    Question_object=new Question(Questions[i].Question_body.join(" "),Questions[i].Choices,Questions[i].Right_Answer,Questions[i].Tag,Questions[i].Number,Questions[i].Passage_ID.Passage,Questions[i].Test_Type,Questions[i].Test,Questions[i]._id)
                    keywords[counter]=Question_object;
                    ++counter;
                    console.log("counter"+" "+counter+" "+keywords.length);
                }

            });
            this.List_TaggedQuestions=keywords;
            console.log("Size of List Tagged Quesstion"+this.List_TaggedQuestions.length);
        }

        this.Last_Question=this.List_TaggedQuestions.pop();

        return this.Last_Question
    }
    getSame_DifficultyQuestions(){
        //populate difficulty list (if any change in difficulty occured)
        this.initializeDifficulty_List();
        return;
    }
    getWeaknessQuestions(){

    }
   async getNextQuestion(){
        console.log("Inside Get ORdered Question_Test TYpe(), Database.js",this.Test," ",this.Test_Type)
        var Choice_List=[]
        //populate difficulty list (if any change in difficulty occured)
        var keywords=[];

        if (this.List_Questions.length<=2){
            console.log("Replenising Normal List")
            var temp_object=dict[this.Test_Type].find({Test:this.Test,Test_Type:this.Test_Type}).populate("Passage_ID").lean()
           await temp_object.exec( function(err,Questions){

                var counter=0;
                var Question_object=null;
                // console.log("Table"+artworks)
                for  (var i=0;i<Questions.length;++i){
                    console.log("Test being returned: "+Questions[i].Test);
                    for(var j=0;j<Questions[i].Choices.length;++j){
                        Questions[i].Choices[j]=Questions[i].Choices[j].replace(/,/g, ' ');
                    }
                    Question_object=new Question(Questions[i].Question_body.join(" "),Questions[i].Choices,Questions[i].Right_Answer,Questions[i].Tag,Questions[i].Number,Questions[i].Passage_ID.Passage,Questions[i].Test_Type,Questions[i].Test,Questions[i]._id)
                    keywords[counter]=Question_object;
                    ++counter;
                    console.log("counter"+" "+counter+" "+keywords.length);
                }



            });
            this.List_Questions=keywords;
            console.log("List of QUestions"+this.List_Questions.length);

        }

        this.Last_Question=this.List_Questions.pop();

        return this.Last_Question

    }///Give me all the questions of a test in order 1-10,11-20 etc



    setStudent(Student_Object){
        this.Student=Student_Object
    }
    SearchQuestion(text){
        var List = [];
        var counter=0;
        var Question_object=null;

        dict[this.Test_Type].find({"Question_body":{"$regex":text}},'Question_body Choices Tag Test Number ' +
            'Test_Type Right_Answer Passage').then( (artworks) => {

            var Question_object=null;
            // console.log("Table"+artworks)
           // console.log("INside the Database Search")
            artworks.forEach( (artwork) => {

                //console.log("Returning Question"+artwork.Question_body.join(" "))
                //console.log("Choices"+artwork.Choices[counter].replace(/,/g, ' '))
                //console.log("Returning Tag"+artwork.Tag)

                for(var i=0;i<artwork.Choices.length;++i){
                    artwork.Choices[i]=artwork.Choices[i].replace(/,/g, ' ');
                }
                //console.log("Returning Choices"+artwork.Choices)
                console.log(" ")

                Question_object=new Question(artwork.Question_body.join(" "),artwork.Choices,artwork.Tag)

                Question_object.setEditQuestion(artwork.Question_body.join(" "),artwork.Choices,artwork.Tag,
                    artwork.Number,artwork.Test,artwork.Test_Type,artwork.Right_Answer,artwork.Passage)
                List[counter]=Question_object;
            ++counter;

            });

            async.parallel(List, function(err, result) {
                console.log("Returning"+" "+List.length)
                return List;
                if (err)
                    return console.log(err);
                console.log(result);
            });
            console.log("Inside Database"+" "+List.length)



        });

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
    async addNewQuestion(BodyList){
        console.log("Inside adding new Question in Database: Passage-->"+" "+BodyList[10]+"Question Body"+BodyList[0]+"Tag::  "+BodyList[6][0]+" "+BodyList[7])
        var newQuestion;
        var newPassage;
        var Object_ID;
        console.log("This is the Passage being saved"+" "+BodyList[10])
        newPassage = new Passage_table({
            Passage:BodyList[10],
            Picture_Path:""
        });
        await newPassage.save(function(err,object){
            if (err) {
                console.log("Error caough"+err.toString())
            }
            console.log("object_ID"+" "+object.id)
            Object_ID=object.id;

        });


        console.log("inside inside"+" "+Object_ID)
        newQuestion = new dict[BodyList[8][0]]({
            Question_body: BodyList[0],
            Passage_ID:Object_ID,
            Tag:BodyList[6][0],
            Choices:[BodyList[1],BodyList[2],BodyList[3],BodyList[4],BodyList[5]],
            Test:BodyList[7][0],
            Test_Type: BodyList[8][0],
            Right_Answer: BodyList[9][0],
            Number: BodyList[11][0]

        });
        newQuestion.save(function (err,object) {
            if (err) {
                console.log("Error caough"+err.toString())
            }


                //const title='Successful Entry of Question, if you would like to enter new questions please do below...'
                //res.render('AddQuestions',{ title })
        });



    }
    async saveResponse(response){
        var Object_ID;
        console.log("Inside saveResponse")
        console.log("Going in saving"+" "+response+" "+this.Student.ID+" "+this.Last_Question._id+" "+this.Student.ID)
        var newReponse = new Response_table({
            Response:response,
            Student:this.Student.ID,
            on:this.Last_Question._id,
            onModel:dict[this.Test_Type]

        });
        await newReponse.save(function(err,object){
            if (err) {
                console.log("Error caough"+err.toString())
            }
            console.log("object_ID"+" "+object.id)
            Object_ID=object.id;

        });



    }
    getHarderQuestion(){

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
    getStudentID(firsName,lastName,email){
        var _ID=0;
        //First search if he's in there, if not, insert into Student SChema Tble and return newly ID
        StudentSchema.findOne({email:email },'_id').then((artwork) => {
            console.log("Found Student in Table"+artwork._id)
            _ID=artwork._id
            console.log("ID if found?"+_ID)
            if (_ID==0){//Than its a new student
                var newStudent = new StudentSchema({
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
            return _ID

        })

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
}