var Request = module.exports = function(service) {
	this._service = service;
	this._xhr = new XMLHttpRequest();
    this.url = "";
    this.method = "GET";
    this.headers = Object.create(null);
    this.body = null;
    this.timeout = 60 * 1000;
};

Request.prototype.setUrl = function(url) {
    this.url = url;
    return this;
};

Request.prototype.setMethod = function(method) {
    this.method = method;
    return this;
};

Request.prototype.setHeader = function(name, value) {
    this.headers[name] = value; // todo: support multi-value headers
    return this;
};

Request.prototype.setBody = function(data) {
    this.body = data;
    return this;
};

Request.prototype.send = function(callback) {
	this._service.send(this, callback);
};
