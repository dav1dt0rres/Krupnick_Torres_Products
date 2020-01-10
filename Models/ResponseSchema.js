var mongoose = require('mongoose');

const Schema = mongoose.Schema;
var ResponseSchema = new Schema( {
    Response:String,
    Time:String,
    Student_ID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    modelId:{
        type:Schema.Types.ObjectId,
        required:true,
        refPath: 'modelName_1'

    },
    modelName_1:{
        type: String,
        required:true,
        enum:["ReadingQuestion","MathQuestion","EnglishQuestion"]

    },
    time_stamp : { type : Date, default: Date.now },
    Session:Number,
    Hint_Selection: Boolean,
    Check_Answer:Number,
    Repeats:Number,
    Views:Number,
    Total_Time:String,
    Hover_History:[String],
    Confidence:Number,
});



//module.exports=QuestionSchema
module.exports=mongoose.model('Response', ResponseSchema);
