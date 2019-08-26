var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var AddressSchema = new Schema({
    latitude : {type : String , required : true , max:100},
    longitude : {type : String , required : true , max:100},
    city : {type : String , required : true , max:100},
    district : {type : String , required : true , max:100},
    street : {type : String , required : true , max:100}
});

module.exports=mongoose.model('Address',AddressSchema);
