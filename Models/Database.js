var mongoose = require('mongoose');
var Question_database = mongoose.model('Question');
var temp_Schema=require('../Models/Question');
const StudentSchema = mongoose.model('Student');
const SessionSchema=mongoose.model('Session')
const async = require('async');
const Question = require('./Question.js');
module.exports= class Database {

    constructor(Test_Type,Test_Number) {
        this.database  ;
        console.log('inside Database COnstructor')
        this.List_Questions=[];
        this.Test_Type=Test_Type;
        this.Test=Test_Number
    }
    DeleteEntries() {




        Question_database.find({ }).remove().exec();
       // this.getNumberofQuestions();


    }
    getNumberofQuestions(){
        this.getOrderedQuestions();

        return this.List_Questions.length;
    }

    // Adding a method to the constructor
    InitializeQuestions(){
        //this.getOrderedQuestions()
        this.getOrderedQuestions_Test_Type()//Test and Type
    }

    getQuestion() {///Here the interaction  might not happen if there are  questions in the list left.

        if (this.List_Questions.length==0){
            console.log("Needs to refresh")
            this.getOrderedQuestions_Test_Type()
            //this.getAllQuestions()


        }

        return this.List_Questions.pop();
    }

    getTestQuestions(){

    }
    getSubjectQuestions(){

    }

    getOrderedQuestions_Test_Type(){
        console.log("Inside Get ORdered Question_Test TYpe(), Database.js",this.Test," ",this.Test_Type)
        var Choice_List=[]

        Question_database.find({Test:this.Test,Test_Type:this.Test_Type},'Question_body Choices Tag Test Test_Type Passage').then( (artworks) => {
            var keywords = [];
            var counter=0;
            var Question_object=null;
           // console.log("Table"+artworks)
            artworks.forEach( (artwork) => {

                console.log("Question Here"+" "+artwork.Question_body.join(" "))
                //console.log("Choices"+artwork.Choices[counter].replace(/,/g, ' '))


                for(var i=0;i<artwork.Choices.length;++i){
                    console.log("Choices being returned",artwork.Choices[i])
                    artwork.Choices[i]=artwork.Choices[i].replace(/,/g, ' ');
                }

                console.log("Tag"+artwork.Tag+" "+artwork.Passage);
                //artwork.Tag,artwork.Number,artwork.Right_Answer,artwork.Passage.join(" ")
               Question_object=new Question(artwork.Question_body.join(" "),artwork.Choices,artwork.Tag,artwork.Number,artwork.Passage)

                keywords[counter]=Question_object;
                ++counter;
                console.log("counter"+" "+counter+" "+keywords.length);
            });
            this.List_Questions=keywords;
            console.log("List of QUestions"+this.List_Questions);

        });

    }///Give me all the questions of a test in order 1-10,11-20 etc
    SearchQuestion(text){
        var List = [];
        var counter=0;
        var Question_object=null;

        Question_database.find({"Question_body":{"$regex":text}},'Question_body Choices Tag Test Number ' +
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

        Question_database.find({Tag:Question_Object.getTag() },'Question_body Choices Tag').then( (artworks) => {
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
    addNewQuestion(BodyList){
        console.log("Inside adding new Question in Database"+" "+Body_List[10]+"Question Body"+Body_List[0]+"Tag::  "+Body_List[6][0]+" "+Body_List[7])
        var newQuestion = new Question_database({
            Question_body: Body_List[0],
            Tag:Body_List[6][0],
            Choices:[Body_List[1],Body_List[2],Body_List[3],Body_List[4],Body_List[5]],
            Test:Body_List[7][0],
            Test_Type: Body_List[8][0],
            Right_Answer: Body_List[9][0],
            Passage:Body_List[10][0],
            Number: Body_List[11][0]

        });
        newQuestion.save(function (err) {
            if (err) {
                console.log("Error caough"+err.toString())
            }


            //const title='Successful Entry of Question, if you would like to enter new questions please do below...'
            //res.render('AddQuestions',{ title })
        })
    }
    getHarderQuestion(){

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
                newStudent.save(function (err) {
                    if (err) return handleError(err);
                    console.log("Successfully saved student")

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
}