'use strict';

var service = require('./dbservice');
var mongoStore = require('koa-session-mongo');
var ObjectID = require('mongodb').ObjectID;

var Service = function() {
	this.collectionName = 'region';

	//更新 先删除，然后再插入
	this.update = function*(obj) {
		var isExist = yield this.isExist();

		if (isExist) {
			yield this.drop();
		}
		var res = yield this.insert(obj);
		return res;
	}

	this.getAreaByPCode = function*(pCode) {
		var res = yield this.find({
			pCode: pCode
		});
		return res;
	}

	this.getAll = function*() {
		var res = yield this.find({});
		return res;
	}

	if (Service.instance == null) {
		Service.instance = this;
	}
	return Service.instance;
}

Service.prototype = service;

module.exports = Service;