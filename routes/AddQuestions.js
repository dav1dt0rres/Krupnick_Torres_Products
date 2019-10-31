
const express = require('express')
var mongoose = require( 'mongoose' )

var Database=require('../Objects/Database.js');
const router = express.Router()
const Question_Schema = mongoose.model('ReadingQuestion');

let jsdom = require('jsdom').JSDOM

var Current_Sessions=[]
var Database_Object;



router.get('/', (req, res, next) => {
   console.log("INside AaddQuestions")


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

router.post('/', async (req, res, next) => {
    Database_Object=new Database("MISC",0,1,[0,1,2]);
    if (req.body.hasOwnProperty("ReadIn_Button")){

        Database_Object.ReadIn()
    }
    else if( req.body.hasOwnProperty("Edit_Button")){
        console.log("Edit Button was pressed! "+Current_Sessions.length)
        var title="Search/Edit a Question"
        res.render('EditQuestion',{title,Database_Index: Current_Sessions.length})
        Current_Sessions.push(Database_Object)

    }
    else if(req.body.hasOwnProperty("Search")){

        console.log("Inside Post /AddQuestions"+req.body.Enter_Text+" "+req.body.Number+" "+req.body.Test_Type+" "+req.body.Test+" "+req.body.Database_Index )

        var Database_Object=Current_Sessions[req.body.Database_Index]
        var List = await Database_Object.SearchQuestion(req.body.Enter_Text,req.body.Number,req.body.Test_Type,req.body.Test )
        Current_Sessions.push(Database_Object);

        console.log("Choices "+List[0].Right_Answer)
        var title="This is the Recalled Question"

        res.render('AddQuestions',{ title,QuestionText:List[0].Question_text,Passage_Holder:List[0].Passage,Test_Holder:List[0].Test,Test_Type_Holder:List[0].Test_Type,Question_Number:List[0].Number,AnswerA:List[0].getOptions()[0],
            AnswerB:List[0].getOptions()[1],AnswerC:List[0].getOptions()[2],
            AnswerD: List[0].getOptions()[3], AnswerE:List[0].getOptions()[4],Right_Answer_Holder:List[0].Right_Answer,Tag:List[0].Tag,
            Database_Index: req.body.Database_Index})
    }
    else if ( req.body.hasOwnProperty("Save_Button")){//ADd Question was pressed

        console.log("Going in"+" "+req.body.QuestionText+req.body.AnswerA+ req.body.AnswerB+
            req.body.AnswerC+req.body.AnswerD+" "+req.body.Tag+" "+req.body.RightAnswer+" "+"THIS IS THE PASSAGE"+" "+req.body.Passage,
            "THIS IS THE QUESTION NUMBER"+" " +req.body.Question_Number+" "+req.body.Test_Type+" "+req.body.Test)

        Body_List=ParseText([req.body.QuestionText,req.body.AnswerA,req.body.AnswerB,req.body.AnswerC,req.body.AnswerD,req.body.AnswerE,
            req.body.Tag,req.body.Test.toString(),req.body.Test_Type.toString(),req.body.RightAnswer,req.body.Passage,req.body.Question_Number])


        await Database_Object.addNewQuestion(Body_List);

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