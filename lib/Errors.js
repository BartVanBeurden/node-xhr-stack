var TimeoutError = function(message, req) {
	Error.call(this, message);
	this.req = req;
};

TimeoutError.prototype = new Error();

var NetworkError = function(message, req) {
	Error.call(this, message);
	this.req = req;
};

NetworkError.prototype = new Error();

module.exports = {
	TimeoutError: TimeoutError,
	NetworkError: NetworkError
};
