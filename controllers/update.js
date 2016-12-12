'use strict';

var ServiceUpdate = require('../services/service_update.js');
var serviceUpdate = new ServiceUpdate();

var ServiceRegion = require('../services/service_region.js');
var serviceRegion = new ServiceRegion();

var request = require("koa-request");
const QUERY_CRMREGION_URL = "http://appb.mama100.cn/sys/o2o/queryCrmRegion.do?devid=354316058871353&verNo="

var StringUtil = require('../libs/StringUtil');
var stringUtil = new StringUtil();
//根据session_id去数据库里去查找是否合法
module.exports.update = function* update() {

	var ver = yield serviceUpdate.findDataVersion(serviceRegion.collectionName);

	var version = 0;
	if (ver) {
		version = ver.version;
	}
	var url = QUERY_CRMREGION_URL + version;

	console.log("更新数据的URL：" + url);

	var options = {
		url: url
	};

	var response = yield request(options); //

	var body = JSON.parse(response.body);

	if (!body) {
		this.body = "数据请求失败，更新失败";
	}

	// console.log(body);

	var regions = body.response.crmRegions;


	if (stringUtil.isOptStrNull(regions)) {
		this.body = "数据已经是最新的了";
		return;
	}

	var newVer = body.response.verNo;

	console.log("数据最新的版本是:" + newVer);

	var result = yield serviceRegion.update(regions);

	// console.log("upate result:" + result);

	// if(result){
	yield serviceUpdate.updateDataVersion(serviceRegion.collectionName, newVer);
	// }

	return result;
};