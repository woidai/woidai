var service = require('./dbservice');
var ObjectID = require('mongodb').ObjectID;

var Service = function() {
	this.collectionName = 'videos';

	//全部
	this.findAll = function*() {
		var res = yield this.find({});
		return res;
	}

	//根据ID查询
	this.findById = function*(id) {
		var res = yield this.getById(id);
		return res;
	}

	if (Service.instance == null) {
		Service.instance = this;
	}
	return Service.instance;
}

Service.prototype = service;

module.exports = Service;