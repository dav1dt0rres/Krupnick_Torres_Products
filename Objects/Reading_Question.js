var Question = require('./Question.js'),util = require('util');


function Reading_Question(question_text, optionList,right_answer,tag,number,passage,test_type,test,ID) {

    this.Passage=passage;
    this._id=ID;
    this.Test_Type="ACT-Reading";

    this.Question_text = question_text;
    this.OptionList=optionList;
    this.Response=null;

    this.Time=null;
    this.Number=number;

    this.Tag=tag;

    this.Test=test;

    this.Right_Answer=right_answer;
    this.StudentAnswer=null;



}

util.inherits(Reading_Question, Question);

Reading_Question.prototype.getPassage=function(){
    return this.Passage
    //return this.Passage.replace(',', '');

}
module.exports = Reading_Question;


