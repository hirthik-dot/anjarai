const routerFactory = require('./helper');
const MarqueeItem   = require('../models/MarqueeItem');
module.exports      = routerFactory(MarqueeItem, 'marquee');
