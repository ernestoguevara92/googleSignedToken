const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const express = require('express');
const app = express();
const infoController = require('./controllers/infoController');
const checkAuth = require('./middleware/checkAuth');
const { allStreetsController, streetNameController } = require('./controllers/streetsControllers');

function setupServer(db) {

    // This is a test frontend - uncomment to check it out
    // app.use(express.static('public'));
    
    app.get('/info', checkAuth, infoController);

    // retrieve all unique stree names
    app.get('/streets', checkAuth, allStreetsController);

    app.get('/streets/:street/', checkAuth, streetNameController);

    

    let server = app.listen(8888, () => {
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