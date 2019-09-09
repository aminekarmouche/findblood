var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var OwnerSchema = new Schema({
    firstName : {type : String , required : true , max:100},
    lastName : { type : String , required : true , max :100},
    userName : { type : String , required : true , max :100},
    email : { type : String , required : true , max :100},
    password: { type : String , required : true , max :100},
    resetPasswordToken: {type : String, required : false},
    resetPasswordExpires: {type : Date, required : false}
});

module.exports=mongoose.model('Owner', OwnerSchema);
