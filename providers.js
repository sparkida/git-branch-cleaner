var Foo = require('./Foo');

var createProcessHandler = function () {
	var iap = this;
	return function () {
		console.log('processing this biatch');
		console.log(this);
	};
};

var process = function () {
	console.log('processing this biatch');
	console.log(this);
};


var verify = function () { 
	console.log(this);
	//this.process = createProcessHandler(this);
	this.process = process;

	this.process();
};
module.exports = verify;
