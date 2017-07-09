var request = require('request');
var baseUrl = 'http://localhost:3001/insight-api/';

exports.getTranscation = function(transcationId, cb){
	request(baseUrl+'tx/'+transcationId, function (error, response, body) {
	  if(error) {
		cb(error)
	  }else{
	  	cb(null, JSON.parse(body))
	  }
	});	
};


exports.getBlock = function(blockId, cb){
	request(baseUrl+'txs/?block='+blockId, function (error, response, body) {
	  if(error) {
		cb(error)
	  }else{
	  	cb(null, JSON.parse(body))
	  }
	});
};