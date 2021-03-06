var keystone = require('keystone');

// Pagination parameters
const perPage = 12; // How many properties to be shown per page
const maxPagesListing = 9; // How many numbers of pages to be listed on pagination navigation menu

// Sort options
const sortOptions = {
	priceAsc: 'Lowest price',
	priceDesc: 'Highest price',
	usefulAreaDesc: 'Biggest area',
	usefulAreaAsc: 'Smallest area',
	roomsDesc: 'More rooms',
	roomsAsc: 'Less rooms',
};

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'Properties';
	locals.urlParams = req.query;
	locals.perPage = perPage;
	locals.maxPagesListing = maxPagesListing;
	locals.buildUrl = require('build-url');
	locals.sortOptions = sortOptions;

	// Load the properties by sortOrder
	// Query search
	function queryWithFilters () {
		var propertiesQuery = keystone.list('Property').model.find();
		// Query filters
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
		// Query sorting
		if (req.query.sort) {
			switch (req.query.sort) {
				case 'priceAsc':
					propertiesQuery = propertiesQuery.sort('price');
					break;
				case 'priceDesc':
					propertiesQuery = propertiesQuery.sort('-price');
					break;
				case 'usefulAreaDesc':
					propertiesQuery = propertiesQuery.sort('-usefulArea');
					break;
				case 'usefulAreaAsc':
					propertiesQuery = propertiesQuery.sort('usefulArea');
					break;
				case 'roomsDesc':
					propertiesQuery = propertiesQuery.sort('-rooms');
					break;
				case 'roomsAsc':
					propertiesQuery = propertiesQuery.sort('rooms');
					break;
				default:
					propertiesQuery = propertiesQuery.sort('sortOrder');
			}
		}
		return propertiesQuery;
	}
	// Counting properties
	view.query('propertiesCount', queryWithFilters().count());
	// Query pagination
	let propertiesQuery = queryWithFilters();
	var page = req.query.page || 1;
	propertiesQuery = propertiesQuery.skip((page - 1) * perPage).limit(perPage);
	// Querying
	view.query('properties', propertiesQuery);

	// Render the view
	view.render('property');

};
