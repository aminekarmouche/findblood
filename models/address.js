var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var AddressSchema = new Schema({
    city : {type : String , required : true , max:100},
    district : {type : String , required : true , max:100},
    street : {type : String , required : true , max:100},
    zipcode: {type : String , required : true , max:100}
});

module.exports=mongoose.model('Address',AddressSchema);
