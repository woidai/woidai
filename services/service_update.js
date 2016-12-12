var service = require('./dbservice');
var mongoStore = require('koa-session-mongo');
var ObjectID = require('mongodb').ObjectID;

var Service = function() {
	this.collectionName = 'version';

	//查找某个表的版本
	this.findDataVersion = function*(table) {
		var res = yield this.findOne({table: table});
		return res;
	}


	//更新表的版本
	this.updateDataVersion = function*(table,version) {
		var res = yield this.findOne({table: table});
		console.log("要更新的数据版本表的是：" + res.table);
		res.version = version;
		res.updateDate = new Date();
		var result = yield this.update(res);
		return result;
	}

	if (Service.instance == null) {
		Service.instance = this;
	}
	return Service.instance;
}

Service.prototype = service;

module.exports = Service;