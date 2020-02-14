var Question = require('./Question.js'),util = require('util');

function Math_Question(question_text, optionList,right_answer,tag,number,passage,test_type,test,ID) {

    this.Test_Type="ACT-Math";
    this._id=ID;
    this.Passage=passage; //its already a string by now.
    this.Passage_ID;
    this.Question_text = question_text;
    this.Math_Question_Text=question_text.split(" ") //THis is for making the rendering of equations and symbols easier
    this.OptionList=optionList;
    this.Response=null;

    this.Time='Nan';
    this.Number=number;

    this.Tag=tag;
    this.Repititions=0;
    this.Test=test;

    this.Time_Stamp;
    this.Right_Answer=right_answer;
    this.StudentAnswer=null;
    this.First_Hint=[];
    this.Presentation_Highlight=[];
    this.Hint_Selection;
    this.Check_Answer=0;
    this.Checked_Answers=[];
    this.Eliminated_Answers=[]
    this.Repeats=0;
    this.Views=0;
    this.Second_Hint_Text=[];
    this.Total_Time;
    this.Hover_History=[]
    this.Confidence;
}





util.inherits(Math_Question, Question);


Math_Question.prototype.Math_Function = function () { /* ... */ };

module.exports = Math_Question;