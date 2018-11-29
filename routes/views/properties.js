var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'Properties';

	// Load the properties by sortOrder
	var propertiesQuery = keystone.list('Property').model.find().sort('sortOrder');
	if (req.query.name) {
		propertiesQuery = propertiesQuery.where('name', req.query.name);
	}
	if (req.query.minPrice) {
		propertiesQuery = propertiesQuery.where('price').gte(+req.query.minPrice);
	}
	if (req.query.maxPrice) {
		propertiesQuery = propertiesQuery.where('price').lte(+req.query.maxPrice);
	}
	if (req.query.type) {
		propertiesQuery = propertiesQuery.where('propType', req.query.type);
	}
	var areaType = 'usefulArea';
	switch (req.query.areaType) {
		case 'useful':
			areaType = 'usefulArea';
			break;
		case 'total':
			areaType = 'totalArea';
			break;
	}
	if (req.query.minArea) {
		propertiesQuery = propertiesQuery.where(areaType).gte(+req.query.minArea);
	}
	if (req.query.maxArea) {
		propertiesQuery = propertiesQuery.where(areaType).lte(+req.query.maxArea);
	}
	if (req.query.minRooms) {
		propertiesQuery = propertiesQuery.where('rooms').gte(+req.query.minRooms);
	}
	view.query('properties', propertiesQuery);

	// Render the view
	view.render('property');

};
