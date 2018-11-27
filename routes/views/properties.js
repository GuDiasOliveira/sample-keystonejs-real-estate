var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'Properties';

	// Load the properties by sortOrder
	view.query('properties', keystone.list('Property').model.find().sort('sortOrder'));

	// Render the view
	view.render('property');

};
