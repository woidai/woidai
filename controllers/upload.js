'use strict';

const views = require('co-views');
var parse = require('co-busboy');
var fs = require('fs');
var os = require('os');
var path = require('path');

const render = views(__dirname + '/../views', {
	map: {
		html: 'swig'
	}
});



module.exports.home = function* home(ctx) {
	this.body = yield render('upload');
};

module.exports.uploadFile = function* uploadFile(next) {

	// ignore non-POSTs
	if ('POST' != this.method) return yield next;

	// multipart upload
	var parts = parse(this);

	var part;

	while ((part = yield parts)) {
		// console.log(part.message);
		var stream = fs.createWriteStream(path.join('./public', part.filename));
		part.pipe(stream);
		console.log('uploading %s -> %s', part.filename, stream.path);
	}

	this.redirect('/');
};