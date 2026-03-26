const routerFactory = require('./helper');
const Video         = require('../models/Video');
module.exports      = routerFactory(Video, 'videos');
