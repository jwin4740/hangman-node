// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/wayfair", function (err, db) {
    if (err) {
        return console.dir(err);
    }

    var collection = db.collection('grid');
    collection.findOne({scraped:false}, function(res, doc){
       console.log(doc);
       collection.save(doc);
       process.exit(0);
    });
});