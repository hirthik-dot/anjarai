const routerFactory = require('./helper');
const CategoryCard  = require('../models/CategoryCard');
module.exports      = routerFactory(CategoryCard, 'categories');
