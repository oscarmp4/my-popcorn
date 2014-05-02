
	var Torrent = require('../models/torrent');


	var torrentStream = require('torrent-stream');
	var fs = require('fs');
	var engine;
	
	

	module.exports = {

		/***
		   * Show the current torrent
		   *
		   *
		   *
		   */
		show: function (req, res, next) {
			res.render('index.twig');
		},


		/***
		   * Show the current torrent
		   *
		   *
		   *
		   */
		view: function (req, res, next) {
			if (req.session.torrent) {
				res.render('video.twig');	
			} else {
				res.render('index.twig');
			}
		},


		set: function (req, res, next) {
			if (req.body.torrent) {
				req.session.torrent = req.body.torrent;
			}

			res.redirect('/view');
		},

		stream: function (req, res, next) {
			// console.log(req.session);
			if (req.session.torrent == undefined) {
				return res.redirect('/');
			}

			if (engine) {
				engine.destroy();
			}

	    	engine = torrentStream(req.session.torrent);

			engine.on('ready', function() {
				var file = engine.files[0];
	
		    	// console.log(file);
		        console.log('filename:', file.name);

		  		var total = file.length;
		  		var type = 'video/mp4';
		       
				if (req.headers['range']) {
					var range = req.headers.range;
					var parts = range.replace(/bytes=/, "").split("-");
					var partialstart = parts[0];
					var partialend = parts[1];

					var start = parseInt(partialstart, 10);
					var end = partialend ? parseInt(partialend, 10) : total-1;
					var chunksize = (end-start)+1;
					console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);

					// var file = fs.createReadStream(path, );
					var stream = file.createReadStream({start: start, end: end});
		        
					res.writeHead(206, { 
						'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 
						'Accept-Ranges': 'bytes', 
						'Content-Length': chunksize, 
						'Content-Type': type
					});

					// stream.on('close', function() {
					// 	console.log('close');
					// });
					// stream.on('end', function() {
					// 	console.log('end');
					// 	engine.destroy();
					// });

					// stream.on('unpipe', function() {
					// 	console.log('unpipe');
					// });

					stream.pipe(res);
					
				} else {
					var stream = file.createReadStream();

					console.log('ALL: ' + total);
					res.writeHead(200, {
						'Content-Length': total, 
						'Content-Type': type 
					});
					
					stream.pipe(res);
				}

				

				
				

			});

		}

	};