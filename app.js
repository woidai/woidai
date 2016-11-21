'use strict';
const index = require('./controllers/index');
const messages = require('./controllers/messages');
const videos = require('./controllers/videos');
const upload = require('./controllers/upload');
const deploy = require('./controllers/deploy');


const compress = require('koa-compress');
const logger = require('koa-logger');
const serve = require('koa-static');
const route = require('koa-route');
const koa = require('koa');
const path = require('path');
const app = module.exports = koa();

// Logger
app.use(logger());

app.use(route.get('/', index.home));
// app.use(route.get('/', messages.home));
app.use(route.get('/messages', messages.home));
app.use(route.get('/messages/:id', messages.fetch));
app.use(route.post('/messages', messages.create));
app.use(route.get('/async', messages.delay));
app.use(route.get('/promise', messages.promise));

//db
// const dbhelper = require('./libs/dbhelper');
// app.use(dbhelper());

//video
app.use(route.get('/videos', videos.home));
app.use(route.get('/videos/list', videos.list));
app.use(route.get('/videos/:id', videos.fetch));

//upload
app.use(route.get('/upload', upload.home));
app.use(route.post('/upload/uploadFile', upload.uploadFile));


// Serve static files
app.use(serve(path.join(__dirname, 'public')));

// Compress
app.use(compress());

//404
app.use(function*(next) {
	yield next;
	if (this.body || !this.idempotent) return;
	this.redirect('/404.html');
});

//auto deploy
app.use(route.post('/deploy',deploy.deploy));

if (!module.parent) {
	app.listen(3000);
	console.log('listening on port 3000');
}