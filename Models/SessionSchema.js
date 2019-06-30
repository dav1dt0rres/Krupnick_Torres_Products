var mongoose = require('mongoose');

const Schema = mongoose.Schema;
var SessionSchema = new Schema({
    QuestionID: String,
    StudentID: String,
    Answer: String,
    Time: Number,
    Test: String

});


module.exports.question=mongoose.model('Session', SessionSchema);
