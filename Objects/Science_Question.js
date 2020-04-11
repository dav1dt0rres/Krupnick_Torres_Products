var Question = require('./Question.js'),util = require('util');

function Science_Question(question_text, optionList,right_answer,tag,number,passage,test_type,test,ID) {

    this.Test_Type="ACT-Science";
    this._id=ID;
    this.Passage=passage; //its already a string by now.
    this.Passage_ID;
    this.Question_text = question_text;
    this.Science_Question_Text=question_text.split(" ") //THis is for making the rendering of equations and symbols easier
    this.OptionList=optionList;
    this.Response=null;

    this.Time='Nan';
    this.Number=number;

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
    this.Hover_History=[];
    this.Draw_History=[];
    this.Confidence;
}





util.inherits(Science_Question, Question);
Science_Question.prototype.setPNG_PlaceHolder=function(temp_list){
    this.PNG_PlaceHolder=temp_list;
}
Science_Question.prototype.setPNGPictures=function (picture_objects){//picture objects is a list of tuples (filename,buffer)
    let base64=""
    var temp_list=[];

    picture_objects.forEach(function(object) {
        console.log("Translationing...Science "+object.filename)

       var tuple={
           filename:object.filename,
           data:"data:image/png;base64,"+object.data.toString('base64')
       }
        temp_list.push(tuple);
    });

    this.Picture_png_Objects=temp_list;
    console.log("picture length "+this.Picture_png_Objects.length)


}
Science_Question.prototype.getPicture_png_Objects=function(){
    var temp_list=[];
    this.Picture_png_Objects.forEach(function(object){
        temp_list.push(object.filename+" "+object.data);
    })
    return temp_list.join("*")
}
Science_Question.prototype.eliminateCommas=function(science_option){
    var option_list=science_option.replace(/\s/g,'').split(",")
    var number_counter=0;
    var notvalid=0;
    var valid=0;
    for (var i=0;i<option_list.length;++i){
        if (isNaN(parseInt(option_list[i])) && option_list[i].includes("@")==false && option_list[i].includes("(")==false){

            //console.log("its nota valid number "+option_list[i])
            ++notvalid;

        }
        else{
            ///console.log("it is a valid number "+option_list[i])


            ++valid

        }
    }


       // console.log("returning....(valid)"+  science_option)
        return science_option;

   // console.log("returning "+option_list.join(","))
   // return option_list.join(",")
}
Science_Question.prototype.getScienceDisplayOptions=function(){
   // console.log("get display Science options");
    var temp_list=[]
    for (var i=0;i<this.OptionList.length;++i){
        temp_list.push(this.eliminateCommas(this.OptionList[i]));
    }
    return temp_list
}
Science_Question.prototype.getScienceOptions=function(){//returns a list of the math-formatted options
    var final_string=""
    var final_list=[];
    for(var i=0;i<this.OptionList.length;++i){

        var temp_list=this.OptionList[i].split(" ");
        for(var j=0;j<temp_list.length;++j){
            var math_string;
            if(temp_list[j].includes("<")){
                math_string=this.Math_Algo(temp_list[j])
            }
            else{
                math_string=temp_list[j]
            }
            final_string=final_string+math_string+" ";

        }
        console.log("final string Options(Science):"+final_string.substring(0, final_string.length - 1))
        final_list.push(this.eliminateCommas(final_string.substring(0, final_string.length - 1)));
        final_string=""
    }
    return final_list;
}
Science_Question.prototype.Science_Function = function () { /* ... */ };

module.exports = Science_Question;