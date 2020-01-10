var Question = require('./Question.js'),util = require('util');


function Reading_Question(question_text, optionList,right_answer,tag,number,passage,test_type,test,ID) {

    this.Passage=passage; //its already a string by now.
    this._id=ID;
    this.Test_Type="ACT-Reading";

    this.Question_text = question_text;
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
    this.deleted_Answer=[]
    this.Repeats=0;
    this.Views=0;
    this.Second_Hint_Text=[];
    this.Total_Time;
    this.Hover_History=[]
    this.Confidence;

}

util.inherits(Reading_Question, Question);

Reading_Question.prototype.getPassage=function(){
    return this.Passage //returns a string
    //return this.Passage.replace(',', '');

}
module.exports = Reading_Question;


