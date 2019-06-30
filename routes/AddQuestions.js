
const express = require('express')
var mongoose = require( 'mongoose' )

var Database=require('../Models/Database.js');
const router = express.Router()
const Question_Schema = mongoose.model('Question');
let jsdom = require('jsdom').JSDOM


var Database_Object;



router.get('/', (req, res, next) => {
   console.log("INside AaddQuestions")


    Database_Object=new Database("MISC");



    res.render('AddQuestions',{RightAnswer:"John Smith"})

})
router.get('/DeleteDatabase',function (req, res, next) {
    console.log("inside Delete!!!!!!")
    //title="DataBase Deleted, you may enter a new Question"
    Database_Object.DeleteEntries();
    //res.render('AddQuestions',{ title })
    res.redirect('/AddQuestions')

})

router.get('/EditDatabase',function (req, res, next) {
    console.log("inside Edit Database!!!!!")
    title="Edit a Question"
    //Database_Object.EditQuestion();
    res.render('EditQuestion',{ title })
   // res.redirect('/AddQuestions')

})

router.post('/', (req, res, next) => {

    if( req.body.hasOwnProperty("Edit_Button")){
        console.log("Edit Button was pressed!")
        var title="Search/Edit a Question"
        res.render('EditQuestion',{title})
    }
    else{//ADd Question was pressed

        console.log("Going in"+" "+req.body.QuestionText+req.body.AnswerA+ req.body.AnswerB+
            req.body.AnswerC+req.body.AnswerD+" "+req.body.Tag+" "+req.body.RightAnswer+" "+"THIS IS THE PASSAGE"+" "+req.body.Passage,
            "THIS IS THE QUESTION NUMBER"+" " +req.body.Question_Number+" "+req.body.Test_Type+" "+req.body.Test)
        Body_List=ParseText([req.body.QuestionText,req.body.AnswerA,req.body.AnswerB,req.body.AnswerC,req.body.AnswerD,req.body.AnswerE,
            req.body.Tag,req.body.Test.toString(),req.body.Test_Type.toString(),req.body.RightAnswer,req.body.Passage,req.body.Question_Number])


        Database_Object.addNewQuestion(Body_List);

        const title='Successful Entry of Question, if you would like to enter new questions please do below...'
        res.render('AddQuestions',{ title })
    }



})

function ParseText(List){
    //console.log("Inside Parse Text"+List)
    var Temp=[[]];

    for (var i = 0; i < List.length; i++) {
        var object=[]
        object=List[i].split(' ')
       // console.log("OBject"+object)
        Temp[i]=object
        //console.log("returning Parsed"+Temp)
    }

    return Temp
}


module.exports = router