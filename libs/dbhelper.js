'use strict';

const mongo = require('./mongo');


var database = '';

module.exports = dbhelper;


function dbhelper(options) {
	options = options || {};
	database = options.db || 'vidzy';
	console.log("------dbhelper  mongo---------" + mongo);
	return mongo.db(database);
}


// 插入方法
function* insert(collectionName, obj) {
	return new Promise(function(resolve, reject) {

		var collection = this.mongo.collection(collectionName);
		collection.insert(obj, {
			w: 1
		}, function(err, res) {
			db.close();
			if (err) reject(err);
			else resolve(res[0]);
		});

	});
}

// 更新
function* update(collectionName, obj) {
	return new Promise(function(resolve, reject) {

		var collection = this.mongo.collection(collectionName);
		collection.update({
			_id: new ObjectID(obj._id)
		}, obj, {
			upsert: true,
			w: 1
		}, function(err, res) {
			db.close();
			if (err) reject(err);
			else resolve(res);
		});

	});
}

// 查找一个
function* findOne(collectionName, query, option) {
	return new Promise(function(resolve, reject) {

		var collection = this.mongo.collection(collectionName);
		if (option == undefined || option == null) {
			collection.findOne(query, function(err, res) {
				db.close();
				if (err) reject(err);
				else resolve(res);
			});
		} else {
			collection.findOne(query, option, function(err, res) {
				db.close();
				if (err) reject(err);
				else resolve(res);
			});
		}
	});
}

// 查找多个
function* find(collectionName, query, option) {

	console.log(" find   -----" + this);

	var collection = this.mongo.collection(collectionName);

	return new Promise(function(resolve, reject) {


		if (option == undefined || option == null) {
			collection.find(query).toArray(function(err, res) {
				db.close();
				if (err) reject(err);
				else resolve(res);
			});
		} else {
			collection.find(query, option).toArray(function(err, res) {
				db.close();
				if (err) reject(err);
				else resolve(res);
			});
		}
	});

}

// 删除
function* remove(collectionName, query) {
	return new Promise(function(resolve, reject) {

		var collection = this.mongo.collection(collectionName);
		collection.remove(query, {
			w: 1
		}, function(err, res) {
			db.close();
			if (err) reject(err);
			else resolve(res);
		});

	});
}

// 计数
function* count(collectionName, query, option) {
	return new Promise(function(resolve, reject) {

		var collection = this.mongo.collection(collectionName);
		if (query == undefined || query == null)
			query = {};
		if (option == undefined || option == null) {
			collection.count(query, function(err, count) {
				db.close();
				if (err) reject(err);
				else resolve(count);
			});
		} else {
			collection.count(query, option, function(err, count) {
				db.close();
				if (err) reject(err);
				else resolve(count);
			});
		}

	});
}


module.exports.insert = insert;
module.exports.update = update;
module.exports.findOne = findOne;
module.exports.find = find;
module.exports.remove = remove;
module.exports.count = count;