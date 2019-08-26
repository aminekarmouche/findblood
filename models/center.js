var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var CenterSchema = new Schema({
    centerName : {type : String , required : true , max:100},
    address : {type : Schema.ObjectId, ref:'Address', required:true},
    owner : {type : Schema.ObjectId , ref:'Owner', required:true}
});

module.exports=mongoose.model('Center',CenterSchema);
