var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Property Model
 * =============
 */

var Property = new keystone.List('Property');

Property.add({
	name: { type: String, required: true, index: true },
	price: { type: Types.Money, format: '$0.0,00' },
	phones: { type: Types.TextArray },
	propType: { type: Types.Select, options: [
		{ value: 'house', label: 'House' },
		{ value: 'appartment', label: 'Appartment' },
		{ value: 'townhouse', label: 'Townhouse' },
		{ value: 'other', label: 'Other...' },
	] },
	details: { type: Types.Markdown, default: '# My property :D' },
	totalArea: { type: Number, format: '0' },
	usefulArea: { type: Number, format: '0' },
	rooms: { type: Number, format: '0' },
	createdAt: { type: Date, default: Date.now },
	thumbPhoto: { type: Types.CloudinaryImage },
	photos: { type: Types.CloudinaryImages },
});

Property.defaultSort = '-createdAt';
Property.defaultColumns = 'name, propType, price, createdAt, totalArea, usefulArea, rooms';
Property.register();
