var Request = require("./Request.js");
var Response = require("./Response.js");
var Errors = require("./Errors.js");

var XhrService = module.exports = function() {
	this._sendStack = [];
	this._receiveStack = [];
};

XhrService.prototype.useSend = function(middleware) {
	this._sendStack.push(middleware);
};

XhrService.prototype.useReceive = function(middleware) {
	this._receiveStack.push(middleware);
};

XhrService.prototype.request = function(method, url) {
	return new Request(this)
		.setMethod(method)
		.setUrl(url);
};

XhrService.prototype.send = function(req, callback) {
	var sendStack = this._sendStack.map(function(middleware, index) {
		return function(err) {
			if (err) return callback(err);
			var next = sendStack[index + 1];
			middleware(req, next);
		};
	});
	
	sendStack.push(function(err) {
		if (err) return callback(err);
		
		req._xhr.open(req.method, req.url, true);
		req._xhr.timeout = req.timeout;
		for (var name in req.headers) req._xhr.setRequestHeader(name, req.headers[name]);
		req._xhr.ontimeout = callback.bind(req, new TimeoutError("XHR Timeout", req, null));
		req._xhr.onerror = callback.bind(req, new NetworkError("XHR Network Error", req, null));
		req._xhr.onload = this.receive.bind(this, req, callback);
		req._xhr.send(req.body);
	}.bind(this));
	
	sendStack[0]();
};

XhrService.prototype.receive = function(req, callback) {
	var res = new Response(req);
	
	var receiveStack = this._receiveStack.map(function(middleware, index) {
		return function(err) {
			if (err) return callback(err);
			var next = receiveStack[index + 1];
			middleware(req, res, next);
		};
	});
	
	receiveStack.push(function(err) {
		callback(err, res);
	});
	
	receiveStack[0]();
};
