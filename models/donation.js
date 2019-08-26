var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var DonationSchema = new Schema({
    donationType : {type : String , required : true , max:100},
    importance : {type : String , required : true , max:100}
});

module.exports=mongoose.model('Donation',DonationSchema);
