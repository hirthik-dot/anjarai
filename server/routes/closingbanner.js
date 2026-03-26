const singletonFactory = require('./singleton');
const ClosingBanner    = require('../models/ClosingBanner');
module.exports         = singletonFactory(ClosingBanner, 'closingbanner');
