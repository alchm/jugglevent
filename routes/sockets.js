if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

//////////
// Routes
//////////

define([
    'Router',
    '../controllers/sockets/UserSocketController'
], function (Router, UserSC) {

	var exports = {};

	exports.init = function (io) {

		io.sockets.on('connection', function (socket) {
      		console.log("Connecting new user");
      		console.log("Generating new token");
      		
      		socket.on('example', function (data) {
        		console.log("Example received : " + data);
      		});

    	});
	}

	return exports;

});