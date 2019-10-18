var Question = require('./Question.js'),util = require('util');

function English_Question(question_text, optionList,right_answer,tag,number,test_type,test,ID) {

    this.Passage=passage;
    this.Test_Type="ACT-English";

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

util.inherits(English_Question, Question);


English_Question.prototype.English_Function = function () { /* ... */ };

module.exports = English_Question;