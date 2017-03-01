var Eventus = require('./eventus');

require('./modules/observer')(Eventus);
module.exports = Eventus;