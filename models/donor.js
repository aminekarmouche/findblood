var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var DonorSchema = new Schema({
    firstName : {type : String , required : true , max:100},
    lastName : { type : String , required : true , max :100},
    userName : { type : String , required : true , max :100},
    email : { type : String , required : true , max :100},
    password: { type : String , required : true , max :100},
    bloodType: { type : String , required : true , max :100}
});

module.exports=mongoose.model('Donor', DonorSchema);
