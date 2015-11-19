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
	while(this.handlerGroups.length > 0) {
		if(this.state === 'resolved') {
			this.handlerGroups[0].forwarder.$promise.state = this.state;
			if(this.handlerGroups[0].successCb) {
				try {
					var result = this.handlerGroups[0].successCb(this.value);
					if (result instanceof $Promise) {
						console.log('hi');
						this.handlerGroups[0].successCb(this.value).resolve()
						this.handlerGroups[0].forwarder.resolve() = ;
					} else {
						console.log('bye');
						this.handlerGroups[0].forwarder.resolve(result);
					}
				} catch(e) {
					this.handlerGroups[0].forwarder.reject(e)
				}
			} else {
				this.handlerGroups[0].forwarder.resolve(this.value);
			}
			this.handlerGroups.shift();
		} else if (this.state === 'rejected') {
			if(this.handlerGroups[0].errorCb) {
				try {
					this.handlerGroups[0].forwarder.resolve(this.handlerGroups[0].errorCb(this.value))
				} catch(e) {
					this.handlerGroups[0].forwarder.reject(e)
				}
			} else {
				this.handlerGroups[0].forwarder.resolve(this.value);
			}
			this.handlerGroups.shift();
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
	var theDeferral = defer();
	this.handlerGroups.push({
		successCb: success,
		errorCb: error,
		forwarder: theDeferral
	});
	this.callHandlers();
	return theDeferral.$promise;
};

$Promise.prototype.catch = function(errorCb) {
	return this.then(null, errorCb);
};

Deferral.prototype.resolve = function() {
	if (this.$promise.state === 'pending') {
		if (arguments.length > 0) {
			this.$promise.value = arguments[0];
		}
		this.$promise.state = 'resolved';
	};
	this.$promise.then();
};

Deferral.prototype.reject = function() {
	if (this.$promise.state === 'pending') {
		if (arguments.length > 0) {
			this.$promise.value = arguments[0];
		}
		this.$promise.state = 'rejected';
	};
	this.$promise.then();
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