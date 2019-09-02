let express = require('express');
let  router = express.Router();
let aws = require('aws-sdk');

//could import config

/* GET home page. */
router.get('/', function(req, res, next) {
    AWS.config.update({
        "region": "oHIO",
        "accessKeyId": "",
        "secretAccessKey": ""
       });
    
    let docClient = new AWS.DynamoDB.DocumentClient();
    let table = "sports";

    res.render('index', { title: 'Express' });
});

module.exports = router;

