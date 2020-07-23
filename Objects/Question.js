//THIS IS THE END




function Question(question_text,optionList,right_answer,tag,number,passage,test_type,test,ID) {
    //artwork.Question_body.join(" "),artwork.Choices,artwork.Right_Answer,artwork.Tag,artwork.Number,artwork.Passage,artwork.Test_Type,artwork.Test
    //artwork.Question_body.join(" "),artwork.Choices,artwork.Tag,artwork.Number,artwork.Right_Answer,artwork.Passage.join(" ")
    //artwork.Tag,artwork.Number,artwork.Right_Answer,artwork.Passage.join(" ")


    if (test_type=="ACT-Math"){
        var Math_Question = require('./Math_Question.js')
        return new Math_Question(question_text, optionList,right_answer,tag,number,passage,test_type,test,ID)
    }
    else if (test_type=="ACT-Science"){
        var Science_Question = require('./Science_Question.js')
        return new Science_Question(question_text, optionList,right_answer,tag,number,passage,test_type,test,ID)
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
    Question.prototype.setNumber=function(index){
        this.SetNumber=index;
    }
Question.prototype.addDraw_History=function (draw_object){

    //console.log("setting draw histroy"+draw_history);
    var temp_list=[];
    for(var i=0;i< draw_object.length;++i){

        const tuple = {
            x: draw_object[i].x,
            y: draw_object[i].y
        }
        console.log("Draw HIstory added tuple"+tuple)
        temp_list.push(tuple)

    }
    this.Draw_History.push(temp_list);
    console.log("Draw HIstory added "+this.Draw_History.length)
    //console.log("Completed draw histroy "+this.Draw_History)
    }
    Question.prototype.setDraw_History_Database=function(draw_history){
        var inner=[];
        var outer=[];
        for (var i=0;i<draw_history.length;++i){
            if(draw_history[i].x!=-1){
                inner.push({x:draw_history[i].x,y:draw_history[i].y})
            }
            else{
                //console.log("refreshing"+draw_history[i].x)
                outer.push(inner);
                inner=[]
            }

        }
        console.log("Draw histroy from database "+outer)
        this.Draw_History=outer;
    }
    Question.prototype.setDraw_History=function(draw_history){

        this.Draw_History=draw_history;
        console.log("setting draw histroy "+this.Draw_History);

    }
    Question.prototype.getDrawHistory=function (){
        var temp=[];
        var temp_final=[];
        //console.log("getting draw history!!! "+this.Draw_History.length)
        if(this.Draw_History.length==0){
            console.log("getting draw history, but no history")
            return [];
        }


        for(var i=0;i<this.Draw_History.length;++i){

            for(var j=0;j<this.Draw_History[i].length;++j){

                temp.push(this.Draw_History[i][j].x+"*"+this.Draw_History[i][j].y);

            }
            temp_final.push(temp);
            temp=[];
        }
        //temp_final.push(temp);
        //console.log("getting draw history!!! "+temp_final)
        return temp_final;
    }
    Question.prototype.getDrawHistory_Database=function(){
        var temp=[];
        if(this.Draw_History.length==0){
            console.log("no draw histroy")
            return;
        }
        console.log("there is draw histroy")

        for(var i=0;i<this.Draw_History.length;++i){
            for (var j=0;j<this.Draw_History.length;++j){
                temp.push({x:this.Draw_History[i][j].x,y:this.Draw_History[i][j].y})
            }
            //console.log(this.Draw_History[i].x+" "+this.Draw_History[i].y);

        }
        return temp
    }

    Question.prototype.setHover_History=function (hover_history){
        if( hover_history[0] ==undefined){
        //console.log("hover history setting, empty "+hover_history[0])
        this.Hover_History=["No History"]
        return;
        }
        //console.log("hover history "+hover_history)
        this.Hover_History=hover_history;
    }
    Question.prototype.setResponse=function(response){

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
    Question.prototype.setResponseContinued=function(Question_Object){

        this.Confidence=Question_Object.Confidence;
        this.Response=Question_Object.Response;

        console.log("Copying the questions so he can continue "+this.Response);

    }
    Question.prototype.setResponse_Long=function (response,confidence,old_answer,eliminated_answers,checked_answers){
        console.log("setting Response LONG"+response+" "+old_answer)
        if (response!=old_answer){
            ++this.Repeats;
        }
        this.Confidence=parseInt(confidence)
        this.Checked_Answers=this.Checked_Answers+checked_answers.split(",");
        this.Response=response;
        //console.log("Eliminated Answers split: "+eliminated_answers.split(","))
        this.Eliminated_Answers=eliminated_answers.split(",")
        //console.log("Eliminated Answers joined: "+this.Eliminated_Answers.join(","))
    }
    Question.prototype.setTime=function (time){
        //console.log("INside Setting Time"+time)
        this.Time=time;
    }
    Question.prototype.getTime=function(){

        return this.Time;
    }
    Question.prototype.setTime_Stamp=function(time_stamp){

        //console.log("setting time stamp "+time_stamp.toString().split("-")[0])
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
        if (this.Test_Type=="ACT-Science"){
            return this.getScienceOptions();
        }
        else if(this.Test_Type=="ACT-Math"){
            return this.getMathOptions();
        }
        return this.OptionList;
    }
    Question.prototype.getOptions_Display=function(){
        if (this.Test_Type=="ACT-Science"){
            return this.getScienceDisplayOptions();
        }
        else if(this.Test_Type=="ACT-Math"){
            return this.getMathDisplayOptions();
        }
        return this.OptionList;
    }
    Question.prototype.eliminateCommas=function(math_option){
        //console.log("Comma testing: "+math_option.replace(/\s/g,'').split(","));
        var option_list=math_option.replace(/\s/g,'').split(",")
        var number_counter=0;
        var notvalid=0;
        var valid=0;
        for (var i=0;i<option_list.length;++i){
            if (isNaN(parseInt(option_list[i])) && option_list[i].includes("$")==false && option_list[i].includes("(")==false){

              //console.log("its nota valid number "+option_list[i])
                ++notvalid;

            }
            else{
                ///console.log("it is a valid number "+option_list[i])


                ++valid

            }
        }
        //console.log("Valid: "+valid+" "+"Not valid: "+notvalid)
        if(valid>notvalid){
            //console.log("returning...."+  math_option)
            return math_option;
        }
       // console.log("returning "+option_list.join(" "))
        return option_list.join(" ")


    }
    Question.prototype.getMathOptions=function(){//returns a list of the math-formatted options
        var final_string=""
        var final_list=[];
        for(var i=0;i<this.OptionList.length;++i){
            //console.log("inside getmathOptions:"+this.OptionList[i])
            var temp_list=this.OptionList[i].split(" ");
            //console.log("options temp list "+temp_list)
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
            //console.log("final string Options(Math):"+final_string.substring(0, final_string.length - 1))


            final_list.push(this.eliminateCommas(final_string.substring(0, final_string.length - 1)));
            final_string=""
        }
        return final_list;
    }
    Question.prototype.getPicture_png_Objects=function(){
    var temp_list=[];

    this.Picture_png_Objects.forEach(function(object){
        temp_list.push(object.filename+" "+object.data);

    });
    console.log("returning picture objects "+temp_list.length)
    return temp_list.join("*")
}
    Question.prototype.Math_Algo=function(section){
        var final_string="";
        //console.log("inside math_science algo "+section)
        var math_string=section
        //document.getElementById('QuestionText').style.height="400px";
        var command_list=["ne","frac","sqrt","gt","lt","ge","le","theta","pi","log","div","overline","angle","begin","end","cr","times","cong","cdot","overleftrightarrow","overparen","triangle","infty","perp","downarrow"]

        math_string=math_string.replace(/</g,"(");

        math_string=math_string.replace(/>/g,")");
        var f_p= math_string.indexOf("(");
        math_string=math_string.substring(0,f_p)+"\\"+math_string.substring(f_p)
        //math_string="\\"+math_string;
        var index=0;
        //console.log("Final string before for loop ",math_string)
        index=math_string.lastIndexOf(")",math_string.length-1);
        //console.log("index "+index)


        var math_string_final=math_string.substring(0, index) + "\\" + math_string.substring(index, math_string.length)
        //console.log("math_string_final: ",math_string_final)
        for (var i=0;i<command_list.length;++i){
            if(math_string_final.indexOf(command_list[i])>-1) {
                if( command_list[i]=="ne" && math_string_final.indexOf("overline")==-1){
                    console.log("its a legitame ne")
                    var c_start=math_string_final.indexOf(command_list[i])
                    math_string_final=math_string_final.substring(0,c_start)+"\\"+math_string_final.substring(c_start)
                }
                else if(command_list[i] == "le" && math_string_final.indexOf("angle") == -1 && math_string_final.indexOf("overleftrightarrow")==-1 ){
                    console.log("its a legitame le")
                    var c_start = math_string_final.indexOf(command_list[i])
                    math_string_final = math_string_final.substring(0, c_start) + "\\" + math_string_final.substring(c_start)
                }
                else if(command_list[i] == "angle" && math_string_final.indexOf("triangle") == -1){
                    console.log("its a legitame angle")
                    var c_start = math_string_final.indexOf(command_list[i])
                    math_string_final = math_string_final.substring(0, c_start) + "\\" + math_string_final.substring(c_start)
                }
                else if(command_list[i]!="le" && command_list[i]!="ne" && command_list[i]!="angle" ){
                    //console.log("command "+command_list[i])
                    var c_start = math_string_final.indexOf(command_list[i])
                    math_string_final = math_string_final.substring(0, c_start) + "\\" + math_string_final.substring(c_start)
                }
            }

        }

        //console.log("Final String "+math_string_final)
        return math_string_final;
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