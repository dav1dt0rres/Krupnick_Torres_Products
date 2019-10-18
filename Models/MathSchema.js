var mongoose = require('mongoose');

const Schema = mongoose.Schema;
var MathSchema = new Schema( {
    Question_body: [String],
    Passage_ID:{type: mongoose.Schema.Types.ObjectId,
        ref: 'Passage'

    },
    Tag: String,
    Choices: [[String]],
    Test:String,
    Number: String,
    Test_Type:String,
    Right_Answer:String,
    Picture_Path:String

});



//module.exports=QuestionSchema
module.exports=mongoose.model('MathQuestion', MathSchema);
