var mongoose = require('mongoose');

const Schema = mongoose.Schema;
var EnglishSchema = new Schema( {
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
    Hint_1:[String],
    Deleted_Choices:[Number],
    Presentation_Highlight:[String]

});


//module.exports=QuestionSchema
module.exports=mongoose.model('EnglishQuestion', EnglishSchema);
