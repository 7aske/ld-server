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
const Config = require('./models/Config.js');

mongoose.connect(uri);
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', router);

router.get('/employees', (req, res) => {
	Employee.find({})
		.then(result => {
			res.send(result);
		})
		.catch(err => console.log(err));
});
router.get('/config', (req, res) => {
	Config.findById({ id: 0 }).then(result => {
		res.send(result);
	});
});
router.post('/config/update', (req, res) => {
	const config = req.body.config;
	Config.findByIdAndUpdate({ id: 0 }, config)
		.then(result => {
			res.send(result);
		})
		.catch(err => console.log(err));
});
router.post('/employees/delete', (req, res) => {
	const id = req.body.id;
	Employee.findOneAndRemove({ _id: id }).then(result => {
		res.send(result);
	});
});
router.post('/employees/save', (req, res) => {
	const employees = req.body.employees;
	console.log(employees);
	employees.forEach((e, i, array) => {
		const employee = new Employee(e);
		Employee.find({ _id: e._id })
			.then(result => {
				if (result.length == 0) {
					employee
						.save()
						.then(res => {
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
