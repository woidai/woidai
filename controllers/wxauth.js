'use strict';


var request = require("request");
var co = require("co");

const WXBizDataCrypt = require('../libs/WXBizDataCrypt');
const GET_SESSION_KEY_URL = "https://api.weixin.qq.com/sns/jscode2session?appid=wxd95c962a6b7690df&secret=d7b80d870a7aa764f2114484a89f295c&grant_type=authorization_code&js_code=";


module.exports.wxauth = function* getSession_key(code) {

	co(function*() {
		var url = GET_SESSION_KEY_URL + code;
		console.log("------get_session_key_url-------" + url);
		yield requestPromise(url);
	})
};


function requestPromise(options) {
	return new Promise(function(resolve, reject) {
		request(options, function(err, response, body) {
			if (err) reject(err);
			console.log("------get_session_key_url  response-------" + response);
			resolve(body);
		});
	});
}