var mongoose = require('mongoose');

const Schema = mongoose.Schema;
var PassageSchema = new Schema( {
    Passage:[String],
  Picture_Path:String

});



//module.exports=QuestionSchema
module.exports=mongoose.model('Passage', PassageSchema);
