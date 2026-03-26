const routerFactory = require('./helper');
const Offer         = require('../models/Offer');
module.exports      = routerFactory(Offer, 'offers');
