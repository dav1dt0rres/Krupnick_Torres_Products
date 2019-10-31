var mongoose = require('mongoose');

const Schema = mongoose.Schema;
var ReadingSchema = new Schema( {
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
    Passage:String,
    Hint_1:[Number],
    Deleted_Choices:[Number]
});



//module.exports=QuestionSchema
module.exports=mongoose.model('ReadingQuestion', ReadingSchema);
