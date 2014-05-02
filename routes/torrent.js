
	var app 	= require('neasy');
	var Torrent = require('../controllers/torrent.js');
	
	app.get('/', Torrent.show);
	app.post('/set', Torrent.set);
	app.get('/view', Torrent.view);
	app.get('/stream', Torrent.stream);