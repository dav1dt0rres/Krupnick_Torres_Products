var mongoose = require('mongoose');

const Schema = mongoose.Schema;
var point_schema = new Schema([{ x: Number, y: Number }]);
var ResponseSchema = new Schema( {
    Response:String,
    Time:String,
    Student_ID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    Reading_Question: {
        type: Schema.Types.ObjectId,

        ref: 'ReadingQuestion'
    },
    English_Question: {
        type: Schema.Types.ObjectId,

        ref: 'EnglishQuestion'
    },
    Math_Question:{
        type:Schema.Types.ObjectId,
        ref:'MathQuestion'
    },
    Science_Question:{
        type:Schema.Types.ObjectId,
        ref:'ScienceQuestion'
    },
    Model_Name:String,
    time_stamp : { type : Date, default: Date.now },
    Session:String,
    Hint_Selection: Boolean,
    Check_Answer:Number,
    Checked_Answers:[String],
    Eliminated_Answers:[String],
    Views:Number,
    Total_Time:String,
    Hover_History:[String],
    Draw_History:[point_schema],
    Confidence:Number,
});



//module.exports=QuestionSchema
module.exports=mongoose.model('Response', ResponseSchema);
