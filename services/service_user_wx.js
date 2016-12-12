var service = require('./dbservice');
var ObjectID = require('mongodb').ObjectID;

var Service = function() {
	this.collectionName = 'user_wx';

	//根据OPENID查询
	this.findByOpenid = function*(user_wx) {

		var openid = user_wx.openid;

		var res = yield this.findOne({
			openid: openid
		});

		if (res) {
			//TODO update
			user_wx._id = res._id;
			yield this.update(user_wx);
		} else {
			//TODO insert
			user_wx.createTime = new Date();
			res = yield this.insert(user_wx);
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