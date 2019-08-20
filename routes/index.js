var express = require('express');
var router = express.Router();
const sql = require('mssql');
const request = require('request')

/* GET home page. */
router.get('/', function(req, res, next) {
  
  const config = {
    user     : 'admin',
    password : 'passpass123!',
    server   : "mydatabase.cydhrjj9widh.us-east-2.rds.amazonaws.com",
    database : "findblod_test",
    port     : 1433
  }

  var pool = new sql.ConnectionPool(config);
  
  pool.connect(err => {
    if(err){
      console.log(err);
    } else {
      console.log('Connected to database.');

      const transaction = new sql.Transaction(pool)
      transaction.begin(err => {
        let rolledBack = false;
        transaction.on('rollback', aborted => {
          rolledBack = true;
          console.log('rolledback is true');
        });
    
        new sql.Request(transaction)
          .query('insert into [finance_test].[dbo].[prices] Values (1.12)', (err, result) => {
            if (err) {
              if(!rolledBack) {
                transaction.rollback(err => {
                  console.log('rollback error! ' + err );
                })
              }
            } else {
              transaction.commit(err => {
                //error checks
                if (err != null){
                  console.log('commit error! ' + err );
                } else 
                console.log('committed!');

              })

            }
          });
      }
      );
    }
  });
  //pool.close();

  /*
  request('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&apikey=VXKTEVYG3RAHX6AC', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var content = JSON.parse(body);
      console.log('Hello' + Object.keys(content))
      console.log(content['Meta Data'])
      console.log(content['Time Series (Daily)']['2019-03-20']['1. open'])
      /*content['Meta Data'].open.forEach(element => {
        console.log('test')
      });
      
      //console.log(body) // Print the google web page.
      //res.render('dashboard', { title: 'My Dashbaord' , resultSet: JSON.parse(body)});
   }
})  
*/




  res.render('index', { title: 'Express' });
});

module.exports = router;
