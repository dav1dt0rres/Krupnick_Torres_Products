var mongoose = require('mongoose');

const Schema = mongoose.Schema;
var QuestionSchema = new Schema( {
    Question_body: [String],
    Tag: String,
    Choices: [[String]],
    Test:String,
    Number: String,
    Test_Type:String,
    Right_Answer:String,
    Passage:String

});



//module.exports=QuestionSchema
module.exports=mongoose.model('Question', QuestionSchema);
