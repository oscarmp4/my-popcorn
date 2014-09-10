
	var Torrent = require('../models/torrent');


	var torrentStream = require('torrent-stream');
	var fs = require('fs');
	var engine;
	var post;



	module.exports = {

		/***
		   * Show the current torrent
		   *
		   *
		   *
		   */
		show: function (req, res, next) {
			if (engine) {
				engine.destroy();
			}

			res.render('index.twig');
		},


		/***
		   * Show the current torrent
		   *
		   *
		   *
		   */
		view: function (req, res, next) {
			if (post) {
				res.render('video.twig');
			} else {
				res.render('index.twig');
			}
		},


		set: function (req, res, next) {
			if (req.files.file) {
				post = req.files.file;
			}

			return res.end('');
		},

		stream: function (req, res, next) {
			if (post == undefined) {
				return res.redirect('/');
			}

			if (engine) {
				engine.destroy();
			}

	    	engine = torrentStream(fs.readFileSync(post.path));

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