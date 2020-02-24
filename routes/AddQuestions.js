
const express = require('express')
var mongoose = require( 'mongoose' )

var Database=require('../Objects/Database.js');
const router = express.Router()
const Question_Schema = mongoose.model('ReadingQuestion');
const path = require("path");
const fs = require("fs");
let jsdom = require('jsdom').JSDOM
const multer = require("multer");

const handleError = (err, res) => {
    res
        .status(500)
        .contentType("text/plain")
        .end("Oops! Something went wrong!");
};
var Current_Sessions=[]




router.get('/', (req, res, next) => {
   console.log("INside AaddQuestions")
    var Database_Object=new Database("MISC",0,Current_Sessions.length,[0,1,2]);
    Current_Sessions.push(Database_Object)
    res.render('AddQuestions',{checkbox_math_science:false,Database_Index:Current_Sessions.length-1})

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
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'pictures_test')
    },
    filename: function (req, file, cb) {
        //console.log("file name "+file.name+" "+file.path+" "+file.originalname)
        cb(null, file.originalname + '-' + Date.now())
    }
})

var upload = multer({ storage: storage })
router.post(
    "/upload",
    upload.array('file',5),
    (req, res) => {
        console.log("How many times is it calling this function "+req.body.Number)

        var files = [];
        var fileKeys = Object.keys(req.files);

        fileKeys.forEach(function(key) {
            console.log("file keys "+req.files[key].path)
            files.push(fs.readFileSync(req.files[key].path));
        });


    }
)
router.post('/Search_Question',async (req, res, next) => {
    console.log("inside Search QUestion (AddQUestions)")
    var Database_Object=Current_Sessions[req.body.Database_Index]
    console.log("Databse index"+" "+req.body.Database_Index+" "+Current_Sessions.length)


    console.log(req.body.Enter_Text+" "+req.body.Number+" "+req.body.Test_Type+" "+req.body.Test+" "+req.body.Database_Index )
        var Question_object;
        var box_bool=false;
        await Database_Object.SearchQuestion(req.body.Enter_Text,req.body.Number,req.body.Test_Type,req.body.Test )
        var commandList=""
        var Math_Text;

        var title=""

        Question_object=Database_Object.Last_Question

        console.log("Hints and PResentation "+Question_object.First_Hint.join(" "));
        if(req.body.Test_Type=="ACT-Math"){
            title="This is the Recalled Question, (Math)"
            for (var i=0;i<Question_object.Picture_png_Objects.length;++i){
                Question_object.Picture_png_Objects[i]="data:image/png;base64,"+Question_object.Picture_png_Objects[i];
            }

            Math_Text="placeholder";
            commandList="not equal = 'ne'  \nexponent = ^ \n" +
                "fraction='frac{}{}'\n"+
                "matrix='matrix{1st row cr 2nd row cr 3rd row.......cr..... }'+\n"+
                "absolute value='|   |'\n"+
                "Scientific Notation X='times'\n"+
                "square root='sqrt{}'\n"+
                "angle ='angle'\n"+
                "pi='pi'\n"+
                "theta = 'theta'\n"+
                "subscript = '_'\n"+
                "repeating decimal= 'overline{}'\n"+
                "division symbol = 'div'\n"+
                "logarithmic='log_y x'\n"+
                "greater than='gt'\n"+
                "greater than or equal='ge'\n"+
                "less than ='lt'\n"+
                "less than or equal='le'\n"+
                "DO NOT LEAVE ANY SPACES BETWEEN THE BRACKETS: '<   >'\n"+
                "---------------------------------------------------------------------------------->end\n"
        }
        else if(req.body.Test_Type=="ACT-Science" ){
            title="This is the Recalled Question, (Science)"
            for (var i=0;i<Question_object.Picture_png_Objects.length;++i){
                Question_object.Picture_png_Objects[i]="data:image/png;base64,"+Question_object.Picture_png_Objects[i];
            }

            Math_Text="placeholder";
            commandList="not equal = 'ne'  \nexponent = ^ \n" +
                "fraction='frac{}{}'\n"+
                "square root='sqrt{}'\n"+
                "matrix='matrix{1st row cr 2nd row cr 3rd row.......cr..... }'+\n"+
                "absolute value='|   |'\n"+
                "Scientific Notation X='times'\n"+
                "angle ='angle'\n"+
                "pi='pi'\n"+
                "theta = 'theta'\n"+
                "subscript = '_'\n"+
                "repeating decimal= 'overline{}'\n"+
                "division symbol = 'div'\n"+
                "logarithmic='log_y x'\n"+
                "greater than='gt'\n"+
                "greater than or equal='ge'\n"+
                "less than ='lt'\n"+
                "less than or equal='le'\n"+
                "DO NOT LEAVE ANY SPACES BETWEEN THE BRACKETS: '<   >'\n"+
                "---------------------------------------------------------------------------------->end\n"
        }
        res.render('AddQuestions',{ title,QuestionText:Question_object.Question_text,Passage_Holder:commandList+Question_object.Passage,Test_Holder:Question_object.Test,Test_Type_Holder:Question_object.Test_Type,Question_Number:Question_object.Number,
            AnswerA:Question_object.getOptions()[0],
            AnswerB:Question_object.getOptions()[1],AnswerC:Question_object.getOptions()[2],
            AnswerD: Question_object.getOptions()[3], AnswerE:Question_object.getOptions()[4],Right_Answer_Holder:Question_object.Right_Answer,Tag:Question_object.Tag,

            Image_List_Holder:Question_object.getPicture_png_Objects(),
            Database_Index: req.body.Database_Index, normal_Question_Index:Question_object.Number,checkbox_math_science:box_bool,math_text:Math_Text,
            First_Hint:Question_object.First_Hint.join(" "), Presentation:Question_object.Presentation_Highlight.join(" ")
        })
        Current_Sessions[req.body.Database_Index]=Database_Object;


})
router.post('/ScrollEditQuestions',upload.array("file",8), async (req, res, next) => {

    var Database_Object=Current_Sessions[req.body.Database_Index]
    console.log("Databse index"+" "+req.body.Database_Index+" "+Current_Sessions.length)

    //Database_Object=new Database("MISC",0,1,[0,1,2]);
    console.log("button presse "+req.body.butt+ " "+req.body.submission )
    if( req.body.butt=="edit_question"){
        console.log("Edit Button was pressed! "+Current_Sessions.length)
        var title="Search/Edit a Question"
        res.render('EditQuestion',{title,Database_Index: req.body.Database_Index,normal_Question_Index: 0})


    }

    else if (req.body.submission=="true"){//ADd Question was pressed
        var targetPath="";
        var clean_Passage=req.body.Passage
        if(req.body.Test_Type=="ACT-Math"){
            var files = [];
            var fileKeys = Object.keys(req.files);
            clean_Passage=cleanPassage(req.body.Passage);
            console.log("saving a math question")

            fileKeys.forEach(function(key) {
                console.log("file keys "+req.files[key].path+" "+req.files[key].filename)
                var record={
                    filename:req.files[key].filename,
                    data:fs.readFileSync(req.files[key].path),
                    contentType:'image/png'
                }
                files.push(record);
            });
            Database_Object.setPNGfiles(files)

        }
        else if(req.body.Test_Type=="ACT-Science"){
            var files = [];
            var fileKeys = Object.keys(req.files);
            clean_Passage=cleanPassage(req.body.Passage);

            fileKeys.forEach(function(key) {
                console.log("file keys "+req.files[key].path+" "+req.files[key].filename)
                var record={
                    filename:req.files[key].filename,
                    data:fs.readFileSync(req.files[key].path),
                    contentType:'image/png'
                }
                //record.push(req.files[key].filename,fs.readFileSync(req.files[key].path))

                files.push(record);
            });
            Database_Object.setPNGfiles(files)

        }
        console.log("Going in-Save Button: "+" "+req.body.QuestionText+req.body.AnswerA+req.body.AnswerB+req.body.AnswerC+req.body.AnswerD+" "+req.body.Tag+" "+req.body.RightAnswer+" "+"THIS IS THE PASSAGE"+" "+clean_Passage,
            "THIS IS THE QUESTION NUMBER"+" " +req.body.Question_Number+" "+req.body.Test_Type+" "+req.body.Test)

        var Body_List=ParseText([req.body.QuestionText,req.body.AnswerA,req.body.AnswerB,req.body.AnswerC,req.body.AnswerD,req.body.AnswerE,
            req.body.Tag,req.body.Test.toString(),req.body.Test_Type.toString(),req.body.RightAnswer,clean_Passage,req.body.Question_Number,req.body.First_Hint,req.body.Presentation])

        console.log('Body List new'+req.body.First_Hint+" "+req.body.Presentation)


        await Database_Object.addNewQuestion(Body_List);
        Current_Sessions[req.body.Database_Index]=Database_Object;
        const title='Successful Entry of Question, if you would like to Edit any more Questions you can..'

        res.render('AddQuestions',{ title,Database_Index:req.body.Database_Index
          })
        return;
    }
    else if (req.body.checkbox_math_science){//Math and Science rendering
        console.log("math checbox "+" "+req.body.Test_Type+" "+req.body.Test+" "+req.body.RightAnswer)
        title="this is the Math re rendering"

        var passage_clean=req.body.Passage.replace(/^\s+|\s+$/g, '');
        res.render('AddQuestions',{title,math_text:req.body.math_science_holder,Passage_Holder:passage_clean,Passage:passage_clean,checkbox_math_science:"true", AnswerA:req.body.AnswerA,
            AnswerB:req.body.AnswerB, AnswerC: req.body.AnswerC,AnswerD:req.body.AnswerD,AnswerE:req.body.AnswerE,Tag:req.body.Tag,Question_Number:req.body.Question_Number,
            QuestionText:req.body.QuestionText,Test_Holder:req.body.Test,Test_Type_Holder:req.body.Test_Type,Right_Answer_Holder:req.body.RightAnswer,
            Database_Index:req.body.Database_Index
        })
    }
    else if(req.body.checkbox_science){
        console.log("Science checbox"+" "+req.body.Test_Type+" "+req.body.Test+" "+req.body.RightAnswer)
        title="this is the Science re rendering"

        var passage_clean=req.body.Passage.replace(/^\s+|\s+$/g, '');
        res.render('AddQuestions',{title,math_text:req.body.math_science_holder,Passage_Holder:passage_clean,Passage:passage_clean,checkbox_science:"true", AnswerA:req.body.AnswerA,
            AnswerB:req.body.AnswerB, AnswerC: req.body.AnswerC,AnswerD:req.body.AnswerD,AnswerE:req.body.AnswerE,Tag:req.body.Tag,Question_Number:req.body.Question_Number,
            QuestionText:req.body.QuestionText,Test_Holder:req.body.Test,Test_Type_Holder:req.body.Test_Type,Right_Answer_Holder:req.body.RightAnswer,
            Database_Index:req.body.Database_Index
        })
    }
    else if(parseInt(req.body.normal_Question_Index)!=parseInt(Database_Object.Last_Question.Number) ){
        console.log("Inside get next question at an index")
        var Question_object;

        await Database_Object.getNextQuestion(parseInt(req.body.normal_Question_Index)-1);
        Question_object=Database_Object.Last_Question
        res.render('AddQuestions',{ title,QuestionText:Question_object.Question_text,Passage_Holder:Question_object.Passage,Test_Holder:Question_object.Test,Test_Type_Holder:Question_object.Test_Type,Question_Number:Question_object.Number,
            AnswerA:Question_object.getOptions()[0],
            AnswerB:Question_object.getOptions()[1],AnswerC:Question_object.getOptions()[2],
            AnswerD: Question_object.getOptions()[3], AnswerE:Question_object.getOptions()[4],Right_Answer_Holder:Question_object.Right_Answer,Tag:Question_object.Tag,
            Database_Index: req.body.Database_Index, normal_Question_Index:Question_object.Number})
    }






})
function cleanPassage(Passage){


    var index=Passage.indexOf("end");
    console.log("clean index "+index)
    if(index==-1){
        return Passage;
    }

    return Passage.substring(index+3);

}
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