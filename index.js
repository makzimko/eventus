var Eventus = require('./eventus');

require('./modules/observer')(Eventus);
require('./modules/radio')(Eventus);

module.exports = Eventus;