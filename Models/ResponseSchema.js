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
        enum:['ReadingQuestion',"MathQuestion","EnglishQuestion"]

    }

});



//module.exports=QuestionSchema
module.exports=mongoose.model('Response', ResponseSchema);
