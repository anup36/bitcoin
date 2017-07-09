var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io =  require('socket.io')(server);
var mysql = require('mysql');
var request = require('./Services/request.js');
var async = require('async');
var _ = require('underscore');

app.use(express.static(__dirname + '/node_modules'));
app.get('/', function(req, res){
	res.sendFile(__dirname+'/index.html');
});

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : ''
});
connection.query('USE bitcoins');


//Socket Request for live Testnet data
io.on('connection',function(client){
	
	client.on('join', function(data){
		// console.log('New connection joined');
	});

	//If Testnet give a testnet data
	client.on("tx", function(trans){

		console.log("Transcation Hash ", trans.txid);

		request.getTranscation(trans.txid, function(err, data){
			if(err){
				console.log("err", err);
			}else{
				var creditedAddressData = data['vout'];
				findCalc(creditedAddressData);

			}
		});
	});

	//If Testnet give a BLOCK data
	client.on("block", function(blockHash){
		
		console.log("Block Hash", blockHash);

		request.getBlock(blockHash, function(err, data){
			if(err){
				console.log("err", err);
			}else{
				_.map(data, function(txns){
					var creditedAddressData = txns['vout'];
					findCalc(creditedAddressData);
				});
			}
		});
	});		
});


//UPDATING ADDDRESS VALUE 
function findCalc(creditedAddressData){
	_.map(creditedAddressData, function(addDetails){
		if(addDetails['scriptPubKey']['addresses'] && addDetails['scriptPubKey']['addresses'].length){
			var address = addDetails['scriptPubKey']['addresses'][0];
			if(addDetails['value']){
		     	connection.query('UPDATE `address` SET `value` = `value` + ? WHERE `add` = ?',[addDetails['value'], address], function(error, results){
		     		if(error || !results['changedRows']){
		     			console.log("Value not updated");
		     		}else{
		     			console.log("update succes", results);
		     		}
		     	});				
			}
	     }
	});	
}
console.log("Server started at 3000");
server.listen(3000);