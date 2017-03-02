(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Eventus = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var _proto;
/**
 * Eventus
 *
 * @param {object} options
 * @constructor
 */
function Eventus(options) {
	options = options || {};
	// get new unique ID for object
	this._cid = ++ _proto.counter;
	this._events = {};
	this._listening = {};

	this._parent = null;
	this._child = [];

	assignOptions(this, options);

	_proto.trigger.call(this, 'init', options);
}
Eventus.prototype = {
	counter: 0
};

/**
 * Assign options to object
 * @param {Eventus} obj
 * @param {object} options
 * @private
 */
function assignOptions(obj, options) {
	var attrs = Object.keys(options);
	for (var i = 0; i < attrs.length; i++) {
		var key = attrs[i];

		switch (key) {
			case 'events':
				var events = Object.keys(options[key]);
				for (var j = 0; j < events.length; j++) {
					_proto.on.call(obj, events[j], options[key][events[j]]);
				}
				break;
			case '_block':
				var blockedMethods = options[key];
				for (var j = 0; j < blockedMethods.length; j++) {
					obj[blockedMethods[j]] = throwError(blockedMethods[j]);
				}
				break;
			default:
				obj[key] = options[key];
		}
	}
}

/**
 * Throw error on calling blocked method
 * @param {string} name - method name
 * @returns {Function}
 */
function throwError(name) {
	return function() {
		throw new Error('Can\'t call blocked method ' + name);
	}
}

/**
 * Add event listener
 * @param {string} name - event name
 * @param {function} callback - function to call on this event
 */
Eventus.prototype.on = function(name, callback) {
	this._events[name] = this._events[name] || [];
	this._events[name].push(callback);
};

/**
 * Add one time listener
 * @param {string} name - event name
 * @param {function} callback - function to call on this event
 */
Eventus.prototype.once = function(name, callback) {
	var self = this;
	_proto.on.call(this, name, function once(data) {
		callback.call(self, data);
		_proto.off.call(self, name, once);
	});
};

/**
 * Remove event listener
 * @param {string} name - event name
 * @param {function} callback - function to remove
 */
Eventus.prototype.off = function(name, callback) {
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
 * @param name - event name
 * @param data - event data
 */
Eventus.prototype.trigger = function(name, data) {
	var listeners = this._events[name];
	var args = Array.prototype.splice.call(arguments, 1);
	if (listeners) {
		for (var i = 0; i < listeners.length; i++) {
			listeners[i].apply(this, args);
		}
	}
};

/**
 * Create child element
 * @param {string} name
 * @param {object} options
 * @returns {Eventus}
 */
Eventus.prototype.createChild = function(name, options) {
	if (!name) { throw new Error('Argument name is required'); }
	if (this[name]) { throw new Error('Child element with name ' + name + ' already exists'); }

	var newObj = new this.constructor(options);
	newObj._parent = this;

	this._child.push({
		name: name,
		instance: newObj
	});
	this[name] = newObj;

	_proto.trigger.call(this, 'child:add', name, newObj);
	return newObj;
};

/**
 * Remove child element
 * @param {string|Eventus} element
 */
Eventus.prototype.removeChild = function(element) {
	var option = typeof element == 'string' ? 'name' : 'instance';
	for (var i = 0; i < this._child.length; i++) {
		if (this._child[i][option] == element) {
			var obj = this._child[i];
			delete this[obj.name];
			this._child.splice(i, 1);

			_proto.trigger.call(this, 'child:remove', obj.name, obj.instance);
			_proto.destroy.call(obj.instance);
		}
	}
};

/**
 * Destroy object
 */
Eventus.prototype.destroy = function() {
	if (this._child.length) {
		for (var i = 0; i < this._child.length; i++) {
			_proto.removeChild.call(this, this._child[i].name);
		}
	}
	_proto.trigger.call(this, 'destroy');
	_proto.off.call(this);
};

/**
 * Emit event to all parents
 * @param {string} name - event name
 * @param {object} data - event data
 */
Eventus.prototype.emit = function(name, data, beginner) {
	if (!beginner) {
		beginner = this;
	} else {
		_proto.trigger.call(this, name, data, beginner);
	}
	if (this._parent) {
		_proto.emit.call(this._parent, name, data, beginner);
	}
};

/**
 * Broadcast event to all children
 * @param name
 * @param data
 */
Eventus.prototype.broadcast = function(name, data, beginner) {
	if (!beginner) {
		beginner = this;
	} else {
		_proto.trigger.call(this, name, data, beginner);
	}
	if (this._child.length) {
		for (var i = 0; i < this._child.length; i++) {
			_proto.broadcast.call(this._child[i].instance, name, data, beginner);
		}
	}
};

Eventus.prototype.constructor = Eventus;
_proto = Eventus.prototype;

// public
module.exports = Eventus;

},{}],2:[function(require,module,exports){
var Eventus = require('./eventus');

require('./modules/observer')(Eventus);
require('./modules/radio')(Eventus);

var info = require('./package.json');

Eventus.version = info.version;
Eventus.author = info.author;
Eventus.homepage = info.homepage;

module.exports = Eventus;
},{"./eventus":1,"./modules/observer":3,"./modules/radio":4,"./package.json":5}],3:[function(require,module,exports){
var _proto;

function init(Eventus) {
	_proto = Eventus.prototype;

	Eventus.prototype.listen = listen;
	Eventus.prototype.unlisten = unlisten;
	Eventus.prototype._destroyListening = _destroyListening;
	Eventus.prototype._emitterDestroyer = _emitterDestroyer;
}

/**
 * Listen to event in another object
 * @param {Eventus} obj - object to listen
 * @param {string} name - event name
 * @param {function} callback - function to call on event
 * @memberof Eventus
 */
var listen = function(obj, name, callback) {
	if (!obj || !obj.on) return;

	var listeners;
	if (this._listening[obj._cid]) {
		listeners = this._listening[obj._cid];
	} else {
		listeners = {
			'destroy': [],
			_obj: obj
		};
		listeners['destroy'].push({
			callback: this._emitterDestroyer.bind(this, obj._cid),
			original: this._emitterDestroyer.bind(this, obj._cid)
		});
		_proto.on.call(obj, 'destroy', listeners['destroy'][0].callback);
	}
	listeners[name] = listeners[name] || [];

	function listen() {
		var data = Array.prototype.slice.call(arguments);
		data.unshift(obj);
		callback.apply(this, data);
	}

	_proto.on.call(obj, name, listen);

	listeners[name].push({
		callback: listen,
		original: callback
	});

	this._listening[obj._cid] = listeners;

	bindDestroyer(this);
};

/**
 * Remove listener from another object
 * @param {Eventus} obj - object to listen
 * @param name - event name
 * @param callback - function to remove
 * @memberof Eventus
 */
var unlisten = function(obj, name, callback) {
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

		_proto.off.call(obj, name, listeners[name][index].callback);

		if (index >= 0) {
			listeners[name].splice(index, 1);
		}
		if (listeners[name].length === 0) {
			listeners[name] = undefined;
		}
	} else if (name) {
		var events = Object.keys(listeners[name]);
		for (i = 0; i < events.length; i++) {
			_proto.off.call(obj, name, listeners[name][events[i]].callback);
		}
		listeners[name] = undefined;
	} else {
		var events = Object.keys(listeners);
		for (i = 0; i < events.length; i++) {
			for (j = 0; j < listeners[events[i]].length; j++) {
				_proto.off.call(obj, events[i], listeners[events[i]][j].callback);
			}
		}
		listeners = undefined;
	}
	this._listening[obj._cid] = listeners;
};

/**
 * Bind event to destroy listenings
 * @param {Eventus} obj
 * @private
 */
function bindDestroyer(obj) {
	var events = obj._events['destroy'] || [];
	for (var i = 0; i < events.length; i++) {
		if (events[i] == _destroyListenings) {
			return;
		}
	}

	_proto.on.call(obj, 'destroy', obj._destroyListening);
}

var _emitterDestroyer = function(cid) {
	this._listening[cid] = undefined;
};

/**
 * Remove listening when object destroyed
 * @memberof Eventus
 * @private
 */
var _destroyListening = function() {
	var listening = this._listening;
	var objects = Object.keys(listening);
	for (var i = 0; i < objects.length; i++) {
		_proto.unlisten.call(this, listening[objects[i]]._obj);
	}
};

module.exports = init;
},{}],4:[function(require,module,exports){
var _proto;

function init(Eventus) {
    _proto = Eventus.prototype;

    Eventus.Radio = new Eventus(RadioPrototype);

    Eventus.prototype.subscribe = subscribe;
    Eventus.prototype.unsubscribe = unsubscribe;
}

var ChannelPrototype = {
    _block: ['on', 'once', 'off', 'createChild', 'removeChild']
};

/**
 * Trigger event on channel
 * @param {string} name - event name
 * @param {object} data - event data
 * @public
 */
ChannelPrototype.trigger = function(name, data) {
    var listeners = this._events['radio'];
    var args = Array.prototype.slice.call(arguments);
    if (listeners) {
        for (var i = 0; i < listeners.length; i++) {
            listeners[i].apply(this, args);
        }
    }
};

ChannelPrototype.reply = function(name, callback) {
    this._replies = this._replies || {};

    if (this._replies[name]) {
        throw new Error('Reply with name ' + name + ' already exists');
    }

    this._replies[name] = callback;
};

ChannelPrototype.request = function(name) {
    var args = Array.prototype.splice.call(arguments, 1);
    var reply = this._replies && this._replies[name] || Function;
    return reply.apply(name, args);
};

var RadioPrototype = {
    _block: ['on', 'once', 'off', 'createChild', 'removeChild', 'trigger']
};

/**
 * Get channel by name or create it if needed
 * @param {string} name
 * @public
 * @memberof Eventus.Radio
 */
RadioPrototype.channel = function(name) {
    var channel = this[name];
    if (channel && channel instanceof this.constructor === false) {
        throw new Error('Cant get channel ' + name + '. Name is reserved');
    } else if (!channel) {
        this[name] = channel = _proto.createChild.call(this, name, ChannelPrototype);
    }
    return channel;
};

/**
 * Subscribe to radio channel
 * @param {string} channelName - channel name
 * @param {string} callback - callback to call on event
 * @public
 * @memberof Eventus
 */
var subscribe = function(channelName, callback) {
    var channel = this.constructor.Radio.channel(channelName);
    this.listen(channel, 'radio', callback);
};

/**
 * Unsubscribe from radio channel
 * @param {string} channelName - channel
 */
var unsubscribe = function(channelName) {
    var channel = this.constructor.Radio.channel(channelName);
    this.unlisten(channel);
};

module.exports = init;
},{}],5:[function(require,module,exports){
module.exports={
  "name": "eventus",
  "version": "0.1.1",
  "description": "Eventful object that can everything",
  "keywords": [
    "event",
    "object",
    "emit",
    "broadcast",
    "listener"
  ],
  "homepage": "https://github.com/makzimko/eventus",
  "license": "MIT",
  "author": {
    "name": "Maxim Tkachuk",
    "email": "uakorn@gmail.com",
    "url": "http://makzimko.info"
  },
  "main": "index.js",
  "scripts": {
    "test": "jasmine",
    "build": "jasmine && npm run concat && npm run compress",
    "concat": "browserify index.js > dist/eventus.js -s Eventus",
    "compress": "uglifyjs dist/eventus.js > dist/eventus.min.js --compress --source-map dist/eventus.js.map"
  },
  "devDependencies": {
    "backpack-core": "^0.2.0",
    "browserify": "^14.1.0",
    "jasmine": "^2.5.3",
    "uglify-js": "^2.8.5"
  }
}

},{}]},{},[2])(2)
});