//
//  setup.js
//  Setup Router
//
//  Created by Fangchen Li on 12/10/19.
//  Copyright © 2019 Fangchen Li. All rights reserved.
//


var express = require('express');
var router = express.Router();
const SQLAction = require('../Modules/SQLActions.js');
const fs = require('fs');
const path = require('path');



/* GET Setup Page. */
router.get('/', function(req, res, next) {
	let data = {error: ""}
	if(req.query.error){
		data.error = "Connection to MySQL database failed, please check your database settings."
	}
	res.render('setup', data);
});

/* POST Database Config. */
router.post('/configdb', function(req, res, next) {
	if(!req.body.host || !req.body.username){
		return res.status(400).render("serviceError", { error: {status : 404, stack: "Please Enter a valid host and username combo"} })
	}

	let data = {
		host: req.body.host,
		user: req.body.username,
		password: req.body.password,
	}

	// Assign Config to Global Config Var
	global.config = {
		database: data
	}

	// Try to connect to database
	if(!SQLAction.getConnectionStatus()){
		SQLAction.createConnection(function (status) {

			if(status){
				// Write Config to File for future use
				let configFile = `module.exports = ${JSON.stringify(global.config)}`;
				console.log(configFile)
				fs.writeFile(path.join(__dirname,'../config.js'), configFile, async (err) => {

					if (err) throw err;
					// If Success go to index
					return res.redirect("/")

				});
			}   else    {
				// Fail go back
				return res.redirect("/setup?error=connection")
			}
		})
	}   else {
		return res.redirect("/")
	}

});
module.exports = router;
