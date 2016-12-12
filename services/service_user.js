var service = require('./dbservice');
var service = require('./dbservice');
var ObjectID = require('mongodb').ObjectID;

var Service = function() {
	this.collectionName = 'user';

	//根据OPENID查询
	this.findByOpenid = function*(user) {

		var openid = user.openid;

		var res = yield this.findOne({
			openid: openid
		});

		user.lastLoginTime = new Date();
		if (res) {
			//TODO update
			user._id = res._id;
			yield this.update(user);
		} else {
			//TODO insert
			user.createTime = new Date();
			res = yield this.insert(user);
		}
		return res;
	}

	if (Service.instance == null) {
		Service.instance = this;
	}
	return Service.instance;
}

Service.prototype = service;

module.exports = Service;