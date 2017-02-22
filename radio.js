/**
 * Radio
 *
 * @constructor
 */
function Radio() {
	// get new unique ID for object
	this._cid = ++ arguments.callee.prototype.counter;
	this._events = {};
	this._listening = {};
}
Radio.prototype = {
	counter: 0
};

/**
 * Add event listener
 * @param {string} name - event name
 * @param {function} callback - function to call on this event
 */
Radio.prototype.on = function(name, callback) {
	this._events[name] = this._events[name] || [];
	this._events[name].push(callback);
};

/**
 * Add one time listener
 * @param {string} name - event name
 * @param {function} callback - function to call on this event
 */
Radio.prototype.once = function(name, callback) {
	var self = this;
	this.on(name, function once(data) {
		callback.call(self, data);
		self.off(name, once);
	});
};

/**
 * Remove event listener
 * @param {string} name - event name
 * @param {function} callback - function to remove
 */
Radio.prototype.off = function(name, callback) {
	if (name) {
		if (this._events[name]) {
			if (callback) {
				var index = this._events[name].indexOf(callback);
				if (index >= 0) {
					this._events[name].splice(index, 1);
				}
				if (this._events[name].length === 0) {
					this._events[name] = undefined;
				}
			} else {
				this._events[name] = undefined;
			}
		}
	} else {
		this._events = {};
	}
};

/**
 * Trigger each listener for event
 * @param name
 * @param data
 */
Radio.prototype.trigger = function(name, data) {
	var listeners = this._events[name];
	if (listeners) {
		for (i = 0; i < listeners.length; i++) {
			listeners[i].call(this, data);
		}
	}
};

/**
 * Listen to event in another object
 * @param {Radio} obj - object to listen
 * @param {string} name - event name
 * @param {function} callback - function to call on event
 */
Radio.prototype.listen = function(obj, name, callback) {
	if (!obj || !obj.on) return;
	var self = this;

	var listeners = this._listening[obj._cid] || {};
	listeners[name] = listeners[name] || [];

	function listen(data) {
		callback.call(this, obj, data);
	}

	obj.on(name, listen);

	listeners[name].push({
		callback: listen,
		original: callback
	});

	this._listening[obj._cid] = listeners;
};

/**
 * Remove listener from another object
 * @param {Radio} obj - object to listen
 * @param name - event name
 * @param callback - function to remove
 */
Radio.prototype.unlisten = function(obj, name, callback) {
	if (!obj || !obj.off) return;
	var listeners = this._listening[obj._cid] || {};
	listeners[name] = listeners[name] || [];

	if (name && callback) {
		var index = -1;
		for (i = 0; i < listeners[name].length; i++) {
			if (listeners[name][i].original == callback) {
				index = i;
			}
		}

		obj.off(name, listeners[name][index].callback);

		if (index >= 0) {
			listeners[name].splice(index, 1);
		}
		if (listeners[name].length === 0) {
			listeners[name] = undefined;
		}
	} else if (name) {
		for (i = 0; i < listeners[name].length; i++) {
			obj.off(name, listeners[name][index].callback);
		}
		listeners[name] = undefined;
	} else {
		var events = Object.keys(listeners);
		for (i = 0; i < events.length; i++) {
			for (j = 0; j < listeners[events[i]].length; j++) {
				obj.off(events[i], listeners[events[i]][j].callback);
			}
		}
		listeners = undefined;
	}
	this._listening[obj._cid] = listeners;
};

Radio.prototype.constructor = Radio;
// public
module.exports = Radio;