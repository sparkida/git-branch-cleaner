var providers = require('./providers');
var Foo = function () {
	var foo = this;
	foo.one = 1;
	foo.provider = providers;
	foo.provider();
	//providers.call(foo);
};


new Foo();

