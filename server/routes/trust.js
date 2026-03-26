const routerFactory = require('./helper');
const TrustItem     = require('../models/TrustItem');
module.exports      = routerFactory(TrustItem, 'trust');
