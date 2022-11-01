const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const express = require('express');
const app = express();

function setupServer(db) {

    // This is a test frontend - uncomment to check it out
    // app.use(express.static('public'));
    
    app.get('/info', (req, res) => {
        res.send('Full stack example');
    });

    // retrieve all unique stree names
    app.get('/streets', (req, res) => {
        db.all(`SELECT DISTINCT(name) FROM BikeRackData`)
          .then( data => {
              console.log(data);
              res.send(data);
          });
    });

    app.get('/streets/:street/', (req, res) => {
        let streetName = req.params.street;
        // query based on street
	// NOTE: this is open to SQL injection attack
        db.all(`SELECT * FROM BikeRackData WHERE name = '${streetName}'`)
          .then( data => {
              res.send(data);              
          });
        

    });

    

    let server = app.listen(8080, () => {
        console.log('Server ready', server.address().port);
    });
    
}

sqlite.open( { 
	filename: 'database.sqlite',
	driver: sqlite3.Database 
}).then( db => {
	//console.log('database opened', db);  
  setupServer(db);
  //return db.all('SELECT * from TEST');  
});