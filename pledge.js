/*----------------------------------------------------------------
Promises Workshop: build the pledge.js deferral-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

var $Promise = function() {
	this.handlerGroups = [];
	this.state = 'pending';
	this.thenCalls = 0;
};

var Deferral = function() {
	this.$promise = new $Promise();
};

var defer = function() {
	return new Deferral();
};

$Promise.prototype.callHandlers = function() {
	while(this.handlerGroups.length > this.thenCalls) {
		if(this.state === 'resolved') {
			this.handlerGroups[this.thenCalls].successCb(this.value);
			this.thenCalls++;
		} else {
			break;
		}
	}
	// body...
};

$Promise.prototype.then = function(successCb, errorCb) {
	var success = false;
	var error = false;
	if(typeof successCb === 'function') success = successCb;
	if(typeof errorCb === 'function') error = errorCb;
	this.handlerGroups.push({successCb: success, errorCb: error});
	// body...
	this.callHandlers();
};

Deferral.prototype.resolve = function() {
	if (this.$promise.state === 'pending') {
		if (arguments.length > 0) {
			this.$promise.value = arguments[0];
		}
		this.$promise.state = 'resolved';
	};
	this.$promise.callHandlers();
};

Deferral.prototype.reject = function() {
	if (this.$promise.state === 'pending') {
		if (arguments.length > 0) {
			this.$promise.value = arguments[0];
		}
		this.$promise.state = 'rejected';
	};
}


/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = {
  defer: defer,
};

So in a Node-based project we could write things like this:

var pledge = require('pledge');
…
var myDeferral = pledge.defer();
var myPromise1 = myDeferral.$promise;
--------------------------------------------------------*/