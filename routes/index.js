//
//  index.js
//  Index Router
//
//  Created by Fangchen Li on 12/10/19.
//  Copyright © 2019 Fangchen Li. All rights reserved.
//


var express = require('express');
var router = express.Router();
const SQLAction = require('../Modules/SQLActions.js');
const helper = require('../Modules/PublicMethods.js')
const Employee = require('../Model/EmployeeModel.js');

/* GET home page. */
router.get('/', async function(req, res, next) {
	let data = {
		subtitle: 'Employee Management',
		pageAction: 'userList',
		adminPageGroup: 'users',
		users: []
	};

	// Read All User data
	let users = await SQLAction.SQLSelectAsync("Company.Employee", "*", null, null, null)
	for(let i in users){
		var employee = new Employee();
		employee.initFromDB(users[i]);

		//Prepare data for views
		data.users.push(employee.exportData())
	}
	res.render("userList", data);
});

/* GET Update or Add Employee Page. */
router.get('/edit', async function(req, res, next) {
	let id = req.query.id;
	let data = {
		subtitle: 'New Employee',
		pageAction: id ? 'userEdit' : 'userNew',
		adminPageGroup: 'users',
	};

	// Check if it is update or add
	if(id){
		// If is update read employee info and parse for views
		let user = await SQLAction.SQLFindAsync("Company.Employee", "*", {id: id}, null, null);
		if(!user){
			return res.status(404).render('serviceError', { error: {status : 404, stack: "No Employee Found"} })
		}
		let employee = new Employee();
		employee.initFromDB(user)
		data["content"] = employee.exportData();

		console.log(data)
	}

	res.render("editUser", data);
});

module.exports = router;
