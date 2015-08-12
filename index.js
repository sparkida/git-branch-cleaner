var providers = require('./providers');
var Foo = function () {
	var foo = this;
	foo.one = 1;
	providers.call(foo);
};

Foo.one = 1;
Foo.prototype.one = 1;

console.log(new Foo());
new Foo();
