const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

let db = '';

sqlite.open( { 
	filename: 'database.sqlite',
	driver: sqlite3.Database 
}).then( database => {
    db = database;
	console.log('database opened');  
});

const allStreetsController = async (req, res) => {
    db.all(`SELECT DISTINCT(name) FROM BikeRackData`)
    .then( data => {
        console.log(data);
        res.send(data);
    });
}

const streetNameController = async (req, res) => {
    let streetName = req.params.street;
    // query based on street
// NOTE: this is open to SQL injection attack
    db.all(`SELECT * FROM BikeRackData WHERE name = '${streetName}'`)
      .then( data => {
          res.send(data);              
      });
}

module.exports = { allStreetsController, streetNameController };