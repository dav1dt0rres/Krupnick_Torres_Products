
const express = require('express')
var mongoose = require( 'mongoose' )
var Question_database = mongoose.model('ReadingQuestion');
var Database=require('../Objects/Database.js');
const router = express.Router();
const Question = require('../Objects/Question.js');



router.get('/', function (req, res, next) {

    console.log("Rendering Edit Question")

    Database_Object=new Database();

    var Question_object= Database_Object.SearchQuestion(req.body.Number);


    title="This is the Recalled Question"
    res.render('AddQuestions',{ title })

})

router.post('/', function (req, res, next) {

    console.log("Inside Post /EditQuestion"+req.body.Enter_Text+" "+req.body.Number+" "+req.body.Test_Type+" "+req.body.Test )

    var List = [];
    var counter=0;
    var Question_object=null;
    //////Requesting the Database///////
    Question_database.find({"Question_body":{"$regex":req.body.Enter_Text}},'Question_body Choices Tag Test Number ' +
        'Test_Type Right_Answer Passage').then( (artworks) => {

        // console.log("Table"+artworks)
        console.log("INside the Database Search")
        artworks.forEach( (artwork) => {

            console.log("Returning Question"+artwork.Question_body.join(" "))
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

        console.log("Size"+ " "+List[0].Question_text+" "+List[0].Passage)
        if (List.length==0){
            console.log("Empty List");

            }
          else{
            title="This is the Recalled Question"
              res.render('AddQuestions',{ title,QuestionText:List[0].Question_text,Passage:List[0].Passage,Test:List[0].Test})
        }



    });

    if (req.body.Number!=null){
        var List = [];
        var counter=0;
        var Question_object=null;
        console.log("Inside Searching for other options")
        Question_database.find({"Number":req.body.Number,"Test_Type":req.body.Test_Type, "Test":req.body.Test },'Question_body Choices Tag Test Number ' +
            'Test_Type Right_Answer Passage').then( (artworks) => {

            // console.log("Table"+artworks)
            console.log("INside the Database Search")
            artworks.forEach( (artwork) => {

                console.log("Returning Question"+artwork.Question_body.join(" "))
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

            console.log("Size"+ " "+List[0].Question_text+" "+List[0].Passage)
            if (List.length==0){
                console.log("Empty List");
                title="No Question Found"
                res.render('AddQuestions',{ title})
            }
            else{
                title="This is the Recalled Question"
                res.render('AddQuestions',{ title,QuestionText:List[0].Question_text,Passage:List[0].Passage,Test:List[0].Test})
            }



        });
    }



})

module.exports = router