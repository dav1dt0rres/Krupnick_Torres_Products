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
    else{

    }


}

    Question.prototype.setHover_History=function (hover_history){
        this.Hover_History=hover_history;
    }
    Question.prototype.setResponse=function(response){
        console.log("setting response short")
        this.Response=response;
    }
    Question.prototype.setRepeats=function(repeats){
        this.Repeats=repeats;
    }
    Question.prototype.setHint_Selection=function(hint_selection){
        this.Hint_Selection=hint_selection;
    }
    Question.prototype.setViews=function(views){
        this.Views=views;
    }
    Question.prototype.setTotalTime=function(total_time){
        this.Total_Time=total_time;
    }
    Question.prototype.setTime=function(time){
        this.Time=time;
    }
    Question.prototype.setID=function(id){
        this._id=id;
    }
    Question.prototype.setConfidence=function(confidence){
        this.Confidence=confidence
    }
    Question.prototype.setPassageID=function(passage_ID){
        this.Passage_ID=passage_ID
    }
    Question.prototype.setPresentation_Highlight=function(presentation_list){
        if(presentation_list==null){

            this.Presentation_Highlight=[]
        }
        else{
            this.Presentation_Highlight=presentation_list
        }

    }
    Question.prototype.setEditQuestion=function(Number,Right_Answer,Passage){

        this.Number=Number;

        this.Right_Answer=Right_Answer;
        this.Passage=Passage;
    }
    Question.prototype.setResponse_Long=function (response,confidence,old_answer,eliminated_answers){
        console.log("setting Response LONG"+response+" "+old_answer)
        if (response!=old_answer){
            ++this.Repeats;
        }
        this.Confidence=parseInt(confidence)
        this.Response=response;
        console.log("Eliminated Answers split: "+eliminated_answers.split(","))
        this.Eliminated_Answers=eliminated_answers.split(",")
        console.log("Eliminated Answers joined: "+this.Eliminated_Answers.join(","))
    }
    Question.prototype.setTime=function (time){
        //console.log("INside Setting Time"+time)
        this.Time=time;
    }
    Question.prototype.getTime=function(){

        return this.Time;
    }
    Question.prototype.setTime_Stamp=function(time_stamp){

        console.log("setting time stamp "+time_stamp.toString().split("-")[0])
        //console.log("setting time stamp "+" "+time_stamp.getDay()+" "+time_stamp.getMonth()+" "+time_stamp.getDate()+" "+time_stamp.getFullYear())


        //Date.prototype.getHours()

        //Date.prototype.getMilliseconds()

       // Date.prototype.getMinutes()


        //Date.prototype.getSeconds()
        this.Time_Stamp=time_stamp.toString().split("-")[0];
    }
    Question.prototype.setCheckAnswer=function(value){
        this.Check_Answer=value;
    }
    Question.prototype.setHintSelections=function(boolean){
        this.Hint_Selection=boolean;
    }
    Question.prototype.setCheckAnswer=function(check_answer){
        this.Check_Answer=check_answer;
    }
    // Adding a method to the constructor
    Question.prototype.getOptions=function() {

        return this.OptionList;
    }
    Question.prototype.setFirstHint=function(hint_list) {
        this.First_Hint=hint_list;
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
        //console.log("getting passage inside of question object"+this.Passage)
        return this.Passage
    }
    Question.prototype.getTest_Type=function(){
        return this.Test_Type;
    }
module.exports = Question;