var express = require('express');
var router = express.Router();
const SQLAction = require('../Modules/SQLActions.js');

const Employee = require('../Model/EmployeeModel.js');

/* POST Update Employee Info. */
router.post('/update', async function(req, res, next) {
	console.log(req.body);
	let id = parseInt(req.body.id);

	let employee = new Employee();
	if(id){
		// Check if id is valid
		let currentEmployee = await SQLAction.SQLFindAsync("Company.Employee",  "*",{id: id}, null, null);
		if(!currentEmployee){
			return res.status(400).render("serviceError", { error: {status : 400, stack: "Invalid Employee ID"} })
		}
		// Update Employee Object
		employee.initFromDB(currentEmployee);
	}
	// Check if web data meet requirements
	let result = await employee.updateEmployeeFromWeb(req.body);
	if(result.status){
		res.redirect("/edit?id=" + employee.id)
	}   else    {
		return res.status(400).render("serviceError", { error: {status : 400, stack: result.msg} })
	}


});

/* POST Delete Employee. */
router.get('/delete', async function(req, res, next) {
	let id = req.query.id;
	if(!id){
		return res.status(400).render("serviceError", { error: {status : 400, stack: "No Employee ID"} })
	}
	// Check if ID is valid
	let ifExist = await SQLAction.SQLCheckExistAsync("Company.Employee", {id: id});
	if(!ifExist){
		return res.status(400).render("serviceError", { error: {status : 400, stack: "Invalid Employee ID"} })
	}
	// Perform Deletion
	await SQLAction.SQLDelete("Company.Employee", {id: id});
	res.redirect("/")
});
module.exports = router;
