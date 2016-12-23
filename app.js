'use strict';

const index = require('./controllers/index');
const messages = require('./controllers/messages');
const videos = require('./controllers/videos');
const upload = require('./controllers/upload');
const deploy = require('./controllers/deploy');
const wxauth = require('./controllers/wxauth');
const sessionCtrl = require('./controllers/session');
const update = require('./controllers/update');
const region = require('./controllers/region');

const compress = require('koa-compress');
const logger = require('koa-logger');
const serve = require('koa-static');
const route = require('koa-route');
const koa = require('koa');
const path = require('path');
const app = module.exports = koa();


const stringUtil = require('./libs/StringUtil');

//首页
app.use(route.get('/', index.home));

// Serve static files
app.use(serve(path.join(__dirname, 'public')));


//统一校验
app.use(function*(next) {



	//TODO 校验session 排除获取session的接口
	var path = this.path;
	if (path.startsWith('/wxauth/getSession_key')
		 || path.startsWith('/deploy')
		 || path.startsWith('/update')
		 || path.startsWith('/region')) {
		yield next;
		return;
	}
	var length = Object.keys(this.query).length;
	if (length == 0 || this.query.session_id == undefined) {
		this.body = {
			code: '5'
		};
		return;
	}
	//查找
	if (this.query.session_id) {
		var session = yield sessionCtrl.query(this.query.session_id);
		if (!session) {
			this.body = {
				code: '5',
				message: '非法的session'
			};
			return;
		}
	}
	yield next;
	// ignore favicon
	if (this.path === '/favicon.ico') return;
	if (this.body || !this.idempotent) {
		return;
	};
	this.redirect('/404.html');
});

// Logger
app.use(logger());

//具体业务
app.use(route.get('/messages', messages.home));
app.use(route.get('/messages/:id', messages.fetch));
app.use(route.post('/messages', messages.create));
app.use(route.get('/async', messages.delay));
app.use(route.get('/promise', messages.promise));
//video
app.use(route.get('/videos', videos.home));
app.use(route.get('/videos/list', videos.list));
app.use(route.get('/videos/:id', videos.fetch));
//upload
app.use(route.get('/upload', upload.home));
app.use(route.post('/upload/uploadFile', upload.uploadFile));
//微信认证
app.use(route.get('/wxauth/getSession_key', wxauth.getSession_key));
//区域编码
app.use(route.get('/region', region.getAll));
app.use(route.get('/region/:pCode', region.getAreaByPCode));


// Compress
app.use(compress());



//auto deploy
app.use(route.post('/deploy', deploy.deploy));

//更新数据
app.use(route.get('/update', update.update));

// This must come after last app.use()
var server = require('http').Server(app.callback())
var io = require('socket.io')(server);

// Socket.io
io.on('connection', function(socket){
  console.log('a user connected');
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
 

if (!module.parent) {
	app.listen(3000);
	console.log('listening on port 3000');
}