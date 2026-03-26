const routerFactory = require('./helper');
const Announcement  = require('../models/Announcement');
module.exports = routerFactory(Announcement, 'announcement');
