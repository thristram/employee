//
//  EmployeeModel.js
//  Employee Class, Store, Update, Validate and Fetch Employee Info
//
//  Created by Fangchen Li on 12/10/19.
//  Copyright © 2019 Fangchen Li. All rights reserved.
//


const SQLAction = require('../Modules/SQLActions.js');
const helper = require('../Modules/PublicMethods.js');


class Employee{
	constructor(){
		this.id = 0;
		this.employeeID = "";
		this.firstName = "";
		this.lastName = "";
		this.phone = "";
		this.city = "";
		this.state = "";
		this.country = "";
		this.hireDate = 0;
		this.endDate = 0;
	}

	// Parse Data from Web Forms
	async updateEmployeeFromWeb(data){

		let hireDate = 0;
		let endDate = 0;
		if(parseInt(data.id)){
			if(this.id && this.id !== parseInt(data.id)){
				return {status: false, msg: 'Invalid Update'}
			}
			this.id = parseInt(data.id);
		}
		if(!data.form_employeeID){
			return {status: false, msg: "Invalid Employee ID"}
		}
		if(!data.form_first || !data.form_last){
			return {status: false, msg: "Invalid Name"}
		}
		if(!data.form_phone){
			return {status: false, msg: "Invalid Phone"}
		}
		if(!data.form_city || !data.form_state || !data.form_country){
			return {status: false, msg: "Invalid Address"}
		}
		if(!data.form_hire){
			return {status: false, msg: "Invalid Hire Date"}
		}   else {
			hireDate = Date.parse(data.form_hire);
			if(!hireDate || hireDate <= 0){
				return {status: false, msg: "Invalid Hire Date"}
			}
			if(data.form_end){
				endDate = Date.parse(data.form_end);

				if(!endDate || endDate <= 0){
					console.log(endDate)
					return {status: false, msg: "Invalid End Date"}
				}
				if(endDate < hireDate){
					return {status: false, msg : "Hire Date Must before End Date"}
				}
			}
		}
		this.employeeID = data.form_employeeID;
		this.firstName = data.form_first;
		this.lastName = data.form_last;
		this.phone = data.form_phone;
		this.city = data.form_city;
		this.state = data.form_state;
		this.country = data.form_country;
		this.hireDate = hireDate / 1000;
		this.endDate = endDate / 1000;

		this.hDate = "";
		this.eDate = "";

		return await this.writeToDB();
	}

	// Write Data to Database
	async writeToDB(){
		let data = {
			employeeID : escape(this.employeeID),
			firstName : escape(this.firstName),
			lastName : escape(this.lastName),
			phone : escape(this.phone),
			city : escape(this.city),
			state : escape(this.state),
			country : escape(this.country),
			hireDate : this.hireDate,
			endDate : this.endDate,
		}
		let isDuplicatedEID = await SQLAction.SQLCheckExistAsync("Company.Employee", `${this.id ? `id != ${this.id} AND` : ''} employeeID = '${this.employeeID}'`);
		if(isDuplicatedEID){
			return {status: false, msg: "Employee ID Already Exist"}
		}
		if(this.id === 0){
			this.id = await SQLAction.SQLAdd("Company.Employee", data)
		}   else    {
			await SQLAction.SQLSetFieldAsync("Company.Employee", data, {id: this.id})
		}
		return {status: true}
	}

	// Parse Data from Database
	initFromDB(data){
		this.id = data.id;
		this.employeeID = unescape(data.employeeID);
		this.firstName = unescape(data.firstName);
		this.lastName = unescape(data.lastName);
		this.phone = unescape(data.phone);
		this.city = unescape(data.city);
		this.state = unescape(data.state);
		this.country = unescape(data.country);
		this.hireDate = parseInt(data.hireDate);
		this.endDate = parseInt(data.endDate);

		this.hDate = helper.getClassTime(parseInt(this.hireDate));
		this.eDate = helper.getClassTime(parseInt(this.endDate));
	}
	// Export Data to Display in Views
	exportData(){
		return {
			id: this.id,
			employeeID : this.employeeID,
			firstName : this.firstName,
			lastName : this.lastName,
			phone : this.phone,
			city : this.city,
			state : this.state,
			country : this.country,
			hireDate : this.hDate,
			endDate : this.eDate,
		}
	}
}
module.exports = Employee;