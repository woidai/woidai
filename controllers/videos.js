'use strict';
const views = require('co-views');
const parse = require('co-body');

var ServiceVideo = require('../services/service_video.js');
var serviceVideo = new ServiceVideo();

const render = views(__dirname + '/../views', {
  map: { html: 'swig' }
});



module.exports.home = function *home(ctx) {
  var videos = yield serviceVideo.findAll();
  this.body = yield render('videos', { 'videos' : videos });
};

module.exports.list = function *list() {
  this.body = yield serviceVideo.findAll();
};

module.exports.fetch = function *fetch(id) {
  var video = yield serviceVideo.findById(id);
  if (!video) {
    this.throw(404, 'video with id = ' + id + ' was not found');
  }
  this.body = yield video;
};


