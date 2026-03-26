const singletonFactory = require('./singleton');
const NavbarConfig     = require('../models/NavbarConfig');

module.exports = singletonFactory(NavbarConfig, 'navbar');
