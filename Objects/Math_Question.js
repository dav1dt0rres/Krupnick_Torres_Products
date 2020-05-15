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
    this.Draw_History=[]
    this.Tag=tag;
    this.Repititions=0;
    this.Test=test;
    this.Picture_png_Objects=[];
    this.PNG_PlaceHolder=[];
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
    //this.punctuationChoices();
}





util.inherits(Math_Question, Question);
Math_Question.prototype.setPNG_PlaceHolder=function(temp_list){
    this.PNG_PlaceHolder=temp_list;
}
Math_Question.prototype.setPNGPictures=function (picture_objects){
    let base64=""
    var temp_list=[];
    if(picture_objects==undefined){
        return;
    }
    picture_objects.forEach(function(object) {

        var tuple={
            filename:object.filename,
            data:"data:image/png;base64,"+object.data.toString('base64')
        }
        temp_list.push(tuple);
    });
    //console.log("final picture list: "+temp_list)
    this.Picture_png_Objects=temp_list;
    //console.log("picture length "+this.Picture_png_Objects.length)
}
function replace (Passage,index, replacement) {
    return Passage.substr(0, index) + replacement+ Passage.substr(index + 1);
}
Math_Question.prototype.getMathQuestionText=function(){

        console.log("getting Math question text "+this.Math_Question_Text)
        var counter=0;
        for (var position = 0; position < this.Math_Question_Text.length; position++)
        {
            if (this.Math_Question_Text.charAt(position) == "@")
            {
                counter += 1;
            }
        }

        var start=0;
        var bool=true;
        var place_holder=0;
        var end=0;
        var tally=0;
        while(tally<counter){
            start=this.Math_Question_Text.indexOf('@',place_holder+1)
            if(bool){
                this.Math_Question_Text=replace(this.Math_Question_Text,start, "<i>")
                bool=false;
                place_holder=start;
                //console.log("first "+Passage)
            }
            else{
                this.Math_Question_Text=replace(this.Math_Question_Text,start, "</i>")

                bool=true;
                place_holder=start;
                //console.log("second "+Passage)
            }


            ++tally;
            //start=Passage.indexOf('$',place_holder+1)
        }

        return this.Math_Question_Text;


}
Math_Question.prototype.getPicture_png_Objects=function(){
    var temp_list=[];
    console.log("returning picture objects_Math "+this.Picture_png_Objects.length)
    for (var i=0;i<this.Picture_png_Objects.length;++i){
        temp_list.push(this.Picture_png_Objects[i].filename+" "+this.Picture_png_Objects[i].data);
        console.log("temp list so far_PNG "+temp_list)
    }
    console.log("returning picture objects_Math "+temp_list.length)
    return temp_list.join("*")
}
Math_Question.prototype.getMathDisplayOptions=function(){
    console.log("get display math options")
    return this.OptionList;
}
Math_Question.prototype.punctuationChoices=function(){


}
Math_Question.prototype.Math_Function = function () { /* ... */ };

module.exports = Math_Question;