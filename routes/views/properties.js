var keystone = require('keystone');

// Pagination parameters
const perPage = 12; // How many properties to be shown per page
const maxPagesListing = 9; // How many numbers of pages to be listed on pagination navigation menu

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'Properties';
	locals.urlParams = req.query;
	locals.perPage = perPage;
	locals.maxPagesListing = maxPagesListing;
	locals.buildUrl = require('build-url');

	// Load the properties by sortOrder
	// Query filters
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
	// Query pagination
	var page = req.query.page || 1;
	propertiesQuery = propertiesQuery.skip((page - 1) * perPage).limit(perPage);
	// Counting total properties
	view.query('allPropertiesCount', keystone.list('Property').model.count());
	// Querying
	view.query('properties', propertiesQuery);

	// Render the view
	view.render('property');

};
