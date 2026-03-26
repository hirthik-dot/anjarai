const routerFactory = require('./helper');
const AdBanner      = require('../models/AdBanner');
module.exports      = routerFactory(AdBanner, 'ads');
