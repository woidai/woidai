
var ServiceSession = require('../services/service_session.js');
var serviceSession = new ServiceSession();


//根据session_id去数据库里去查找是否合法
module.exports.query = function *query(id) {
  var session = yield serviceSession.findById(id);
  return session;
};
