var Question = require('./Question.js'),util = require('util');

function English_Question(question_text, optionList,right_answer,tag,number,passage,test_type,test,ID) {

    this.Passage=passage;
    this.Passage_ID;
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
    this.Repititions=0;

    this.Time_Stamp;

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
    this.punctuationChoices()
}

util.inherits(English_Question, Question);

English_Question.prototype.punctuationChoices=function(){
    for(var j=0;j<this.OptionList.length;++j){
        //console.log("Choices before "+Questions[i].Choices[j])
        this.OptionList[j]=this.OptionList[j].replace(/,/g, ' ');
        //.log("Choices After "+Questions[i].Choices[j])
    }
    for(var i=0;i<this.OptionList.length;++i){
        if(this.OptionList[i].includes("  ")){
            //console.log("OPtion List before "+i+" "+this.OptionList[i])
            this.OptionList[i]=this.OptionList[i].replace(/  /g, ', ');

            //console.log("OPtion List "+ this.OptionList[i])
        }

    }
}

English_Question.prototype.English_Function = function () { /* ... */ };

module.exports = English_Question;