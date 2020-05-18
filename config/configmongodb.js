const MongoClient = require('mongodb').MongoClient; 
const url = "mongodb://localhost:27017"; 

MongoClient.connect(url, { useNewUrlParser: true }, (err, db)=> { 

    if (err) 
    {
        console.log(err); 
    }

    else 
    {
        console.log('Connected with Mongo database `ambesh`');
    }
 

   exports.dbo = db.db("ambesh"); 
});


           





