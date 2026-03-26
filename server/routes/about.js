const singletonFactory = require('./singleton');
const AboutStrip       = require('../models/AboutStrip');
module.exports         = singletonFactory(AboutStrip, 'about');
