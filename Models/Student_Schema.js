var mongoose = require('mongoose');

const Schema = mongoose.Schema;
var StudentSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    session:Number
    //Baseline:[flo]

});


mongoose.model('Student', StudentSchema);
