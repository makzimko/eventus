var Eventus = require('./eventus');

/**
 * modules
 */
require('./modules/observer')(Eventus);
require('./modules/radio')(Eventus);

/**
 * read package info
 */
var info = require('./package.json');

Eventus.version = info.version;
Eventus.author = info.author;
Eventus.homepage = info.homepage;

module.exports = Eventus;