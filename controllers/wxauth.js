'use strict';

var ServiceUserWX = require('../services/service_user_wx.js');
var serviceUserWX = new ServiceUserWX();

var ServiceUser = require('../services/service_user.js');
var serviceUser = new ServiceUser();

var request = require("koa-request");

var session = require('koa-session-store');
var mongoStore = require('koa-session-mongo');

const WXBizDataCrypt = require('../libs/WXBizDataCrypt');
const APPID = 'wxd95c962a6b7690df';
const SECRET = 'd7b80d870a7aa764f2114484a89f295c';
const GET_SESSION_KEY_URL = "https://api.weixin.qq.com/sns/jscode2session?appid=" + APPID + "&secret=" + SECRET + "&grant_type=authorization_code&js_code=";


var openid = null;
var user_wx = new Object();
var user = new Object();


module.exports.getSession_key = function* getSession_key() {

	var code = this.query.code;
	var encryptedData = this.query.encryptedData;
	encryptedData = encryptedData.replace(/ /g, "+"); //不知道为什么取出来的+号变成空格了
	var iv = this.query.iv;
	var url = GET_SESSION_KEY_URL + code;

	var options = {
		url: url
	};

	var response = yield request(options); //请求微信服务器获取session_key
	var body = JSON.parse(response.body);

	var sessionKey = body.session_key;
	openid = body.openid;

	var sid = guid();

	yield resolveSession(sid, sessionKey +";"+ openid);

	yield decryptData(sessionKey, encryptedData, iv);

	var data = {sid: sid}

	this.body = {data:data,code:'0'};
};

function* decryptData(sessionKey, encryptedData, iv) {
	var pc = new WXBizDataCrypt(APPID, sessionKey);

	var data = pc.decryptData(encryptedData, iv);

	//微信对象
	user_wx.openid = openid;
	user_wx.nickName = data.nickName;
	user_wx.gender = data.gender;
	user_wx.city = data.city;
	user_wx.province = data.province;
	user_wx.avatarUrl = data.avatarUrl;

	yield serviceUserWX.findByOpenid(user_wx);

	user.name = data.nickName;
	user.openid = openid;

	yield serviceUser.findByOpenid(user);

}


function* resolveSession(sid, data) {
	var store = mongoStore.create({
		host: '127.0.0.1',
		port: 27017,
		db: 'vidzy',
		// username: 'admin',
		// password: 'password',
		ssl: false,
		expirationTime: 60 * 60 * 1,
	});
	yield store.save(sid,data);
	session({
		store: store
	});
}


function guid() {
	return 'xxxxxxxx-ixxx-dxxx-axxx-ixxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0,
			v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}