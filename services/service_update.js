var service = require('./dbservice');
var mongoStore = require('koa-session-mongo');
var ObjectID = require('mongodb').ObjectID;
const INIT_SQL = {
	table: "region",
	version: "0"
};

var Service = function() {
	this.collectionName = 'version';

	//查找某个表的版本
	this.findDataVersion = function*(table) {
		var isExist = yield this.isExist();
		var res;
		if (isExist) {
			res = yield this.findOne({
				table: table
			});
		} else {
			yield this.init();
			res = {
				table: table,
				version: 0
			};
		}

		return res;
	}


	//更新表的版本
	this.updateDataVersion = function*(table, version) {
		var res = yield this.findOne({
			table: table
		});
		console.log("要更新的数据版本表的是：" + res.table);
		res.version = version;
		res.updateDate = new Date();
		var result = yield this.update(res);
		return result;
	}

	this.init = function*() {
		console.log("初始化数据表");
		yield this.insert(INIT_SQL);
	}

	if (Service.instance == null) {
		Service.instance = this;
	}
	return Service.instance;
}

Service.prototype = service;

module.exports = Service;