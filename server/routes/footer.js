const singletonFactory = require('./singleton');
const FooterConfig     = require('../models/FooterConfig');
module.exports         = singletonFactory(FooterConfig, 'footer');
