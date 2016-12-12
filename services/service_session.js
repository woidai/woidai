var service = require('./dbservice');
var mongoStore = require('koa-session-mongo');
var ObjectID = require('mongodb').ObjectID;

var Service = function() {
	this.collectionName = 'sessions';

	//根据session_id查询
	this.findById = function*(id) {
		var res = yield this.findOne({_id: id});
		return res;
	}

	if (Service.instance == null) {
		Service.instance = this;
	}
	return Service.instance;
}

Service.prototype = service;

module.exports = Service;