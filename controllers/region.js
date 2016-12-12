'use strict';
const views = require('co-views');
const parse = require('co-body');

var ServiceRegion = require('../services/service_region.js');
var serviceRegion = new ServiceRegion();

const render = views(__dirname + '/../views', {
  map: { html: 'swig' }
});

module.exports.getAreaByPCode = function *getAreaByPCode(pCode) {
  var data = yield serviceRegion.getAreaByPCode(pCode);
  this.body = {data:data,code:'0'};
};


module.exports.getAll = function *getAll() {
  var data = yield serviceRegion.getAll();
  this.body = {data:data,code:'0'};
};


