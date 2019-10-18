var Question = require('./Question.js'),util = require('util');

function Math_Question(question_text, optionList,right_answer,tag,number,test_type,test,ID) {

    this.Test_Type="ACT-Math";
    this._id=ID;


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

util.inherits(Math_Question, Question);


Math_Question.prototype.Math_Function = function () { /* ... */ };

module.exports = Math_Question;