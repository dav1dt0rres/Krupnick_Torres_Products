var mongoose = require('mongoose');

const Schema = mongoose.Schema;
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
    Model_Name:String,
    time_stamp : { type : Date, default: Date.now },
    Session:Number,
    Hint_Selection: Boolean,
    Check_Answer:Number,
    Checked_Answers:[String],
    Eliminated_Answers:[String],
    Views:Number,
    Total_Time:String,
    Hover_History:[String],
    Confidence:Number,
});



//module.exports=QuestionSchema
module.exports=mongoose.model('Response', ResponseSchema);
