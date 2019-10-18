//THIS IS THE END




function Question(question_text,optionList,right_answer,tag,number,passage,test_type,test,ID) {
    //artwork.Question_body.join(" "),artwork.Choices,artwork.Right_Answer,artwork.Tag,artwork.Number,artwork.Passage,artwork.Test_Type,artwork.Test
    //artwork.Question_body.join(" "),artwork.Choices,artwork.Tag,artwork.Number,artwork.Right_Answer,artwork.Passage.join(" ")
    //artwork.Tag,artwork.Number,artwork.Right_Answer,artwork.Passage.join(" ")


    if (test_type=="ACT-Math"){
        var Math_Question = require('./Math_Question.js')
        return new Math_Question(question_text, optionList,right_answer,tag,number,test_type,test,ID)
    }
    else if(test_type=="ACT-Reading"){
        var Reading_Question = require('./Reading_Question.js')

        return new Reading_Question(question_text, optionList,right_answer,tag,number,passage,test_type,test,ID)
    }
    else if(test_type=="ACT-English"){
        var English_Question = require('./English_Question.js')
        return new English_Question(question_text, optionList,right_answer,tag,number,passage,test_type,test,ID)
    }


}



    Question.prototype.setEditQuestion=function(Number,Right_Answer,Passage){

        this.Number=Number;

        this.Right_Answer=Right_Answer;
        this.Passage=Passage;
    }

    // Adding a method to the constructor
    Question.prototype.getOptions=function() {

        return this.OptionList;
    }
    Question.prototype.recordResponse=function(Res,time){

        this.Time=time;
        this.Response=Res
    }
    Question.prototype.getTag=function(){
        return this.Tag;
    }
    Question.getDatabase_ID=function(){
        return this.Database_ID;
    }
    Question.getRightAnswer=function(){
        return this.Right_Answer;
    }
    Question.prototype.getStudentAnswer=function(){
        return this.StudentAnswer;
    }
    Question.prototype.getQuestionText=function(){
        return this.Question_text;
    }
    Question.prototype.getNumber=function(){
        return this.Number;
    }
    Question.prototype.getAnswerList=function(){
        return this.OptionList;
    }
    Question.prototype.getTime=function(){
        return this.Time;
    }
    Question.prototype.getTest=function(){
        return this.Test;

    }
    Question.prototype.getPassage=function(){
        console.log("getting passage inside of question object"+this.Passage)
        return this.Passage
    }
    Question.prototype.getTest_Type=function(){
        return this.Test_Type;
    }
module.exports = Question;