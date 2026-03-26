const singletonFactory = require('./singleton');
const Tagline          = require('../models/Tagline');
module.exports         = singletonFactory(Tagline, 'tagline');
