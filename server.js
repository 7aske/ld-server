const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const app = express();
const router = express.Router();
const user = 'admin';
const pass = 'admin';
const uri = `mongodb+srv://${user}:${pass}@cluster0-p6e4t.mongodb.net/company0`;
const Employee = require('./models/Employee.js');
mongoose.connect(uri);
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});
app.use('/', router);
router.get('/employees', (req, res) => {
	Employee.find({})
		.then(result => {
			res.send(result);
		})
		.catch(err => console.log(err));
});
router.post('/employees/delete', (req, res) => {
	const employees = req.body.employees;
	employees.forEach((employee, i) => {
		Employee.findOneAndRemove({ _id: id })
			.then(result => {
				Employee.find({})
					.then(result => {
						if (i == employees.length - 1) {
							Employee.find({})
								.then(result => {
									res.send(result);
								})
								.catch(err => console.log(err));
						}
					})
					.catch(err => console.log(err));
			})
			.catch(err => console.log(err));
	});
});
router.post('/employees/save', (req, res) => {
	const employees = req.body.save;
	console.log(employees);
	employees.forEach((e, i, array) => {
		const employee = new Employee(e);
		Employee.find({ _id: e._id })
			.then(result => {
				if (result.length == 0) {
					employee
						.save()
						.then(r => {
							if (i == array.length - 1) {
								Employee.find({})
									.then(result => {
										console.log(result);
										res.send(result);
									})
									.catch(err => console.log(err));
							}
						})
						.catch(err => console.log(err));
				} else {
					Employee.findByIdAndUpdate({ _id: e._id }, employee)
						.exec()
						.then(result => {
							console.log(result);
							if (i == array.length - 1) {
								Employee.find({})
									.then(result => {
										console.log(result);
										res.send(result);
									})
									.catch(err => console.log(err));
							}
						})
						.catch(err => console.log(err));
				}
			})
			.catch(err => console.log(err));
	});
});
app.listen(PORT, () => console.log(`Server running on ${PORT}.`));
