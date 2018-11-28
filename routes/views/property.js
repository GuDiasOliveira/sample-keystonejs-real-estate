var keystone = require('keystone');

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);

	// Load the property
	view.query('property', keystone.list('Property').model.findOne({ _id: req.params.propertyId }));

	// Render the view
	view.render('property-view');
};
