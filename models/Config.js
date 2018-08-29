const mongoose = require('mongoose');
const shortid = require('shortid');
const employeeSchema = new mongoose.Schema(
	{
		id: { type: Number, default: 0 },
		asideWidth: { type: Number, default: 400 },
		contentWidth: { type: Number, default: 500 },
		isAsideOut: { type: Boolean, default: true }
	},
	{
		collection: 'config'
	}
);
module.exports = mongoose.model('Config', employeeSchema);
