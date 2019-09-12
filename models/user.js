var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
    firstName : {type : String , required : true , max:100},
    lastName : { type : String , required : true , max :100},
    userName : { type : String , required : true , max :100},
    roles: {
        type: [{
          type: String,
          enum: ['user', 'admin']
        }],
        default: ['user'],
        required: false
      },
    email : { type : String , required : true , max :100},
    password: { type : String , required : true , max :100},
    resetPasswordToken: {type : String, required : false},
    resetPasswordExpires: {type : Date, required : false}
});

module.exports=mongoose.model('User', UserSchema);