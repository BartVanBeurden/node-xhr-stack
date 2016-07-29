var Errors = require("./Errors.js");

var Response = module.exports = function(req) {
	this._req = req;
	this.statusCode = req._xhr.status;
	this.headers = Object.create(null);
	this.body = req._xhr.response;
	
	// parse headers
	req._xhr.getAllResponseHeaders.split("\r\n").forEach(function(header) {
		var nameIndex = header.indexOf(":");
		var name = header.slice(0, nameIndex);
		var value = header.slice(nameIndex + 2);
		
		this.headers[name] = value;
	}.bind(this));
};

Response.prototype.getStatusCode = function() {
	return this.statusCode;
};

Response.prototype.getHeader = function(name) {
	return this.headers[name];
};

Response.prototype.getBody = function(body) {
	return this.body;
};
