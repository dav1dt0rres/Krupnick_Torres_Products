
module.exports= class Question {
    //artwork.Question_body.join(" "),artwork.Choices,artwork.Tag,artwork.Number,artwork.Right_Answer,artwork.Passage.join(" ")

    constructor(question_text, optionList,tag,number,passage) {
        //artwork.Tag,artwork.Number,artwork.Right_Answer,artwork.Passage.join(" ")
        this.Question_text = question_text;
        this.OptionList=optionList;
        this.Response=null;
        this.Database_ID=null;
        this.Time=null;
        this.Number=null;
        this.Tag=null;
        this.Test=null;
        this.Test_Type=null;
        this.Right_Answer=null;
        this.StudentAnswer=null;
        this.Passage=passage;
        console.log("Inside constructor of Question")
    }
    setEditQuestion(Number,Right_Answer,Passage){

        this.Number=Number;

        this.Right_Answer=Right_Answer;
        this.Passage=Passage;
    }
    getPassage(){

        return this.Passage.replace(',', '');

    }
    // Adding a method to the constructor
    getOptions() {
        return this.OptionList;
    }
    recordResponse(Res,time){

        this.Time=time;
        this.Response=Res
    }
    getTag(){
        return this.Tag;
    }
    getDatabase_ID(){
        return this.Database_ID;
    }
    getRightAnswer(){
        return this.Right_Answer;
    }
    getStudentAnswer(){
        return this.StudentAnswer;
    }
    getQuestionText(){
        return this.Question_text;
    }
    getNumber(){
        return this.Number;
    }
    getAnswerList(){
        return this.OptionList;
    }
    getTime(){
        return this.Time;
    }
    getTest(){
        return this.Test;

    }
    getPassage(){
        return this.Passage
    }
    getTest_Type(){
        return this.Test_Type;
}
}