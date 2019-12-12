//
//  SQLAction.js
//  A MySQL Database Access Driver
//
//  Created by Fangchen Li on 12/31/17.
//  Copyright © 2017 Fangchen Li. All rights reserved.
//

'use strict';
const fs = require('fs');
const path = require('path');
/************************************/

//SQL Action//

/************************************/


// var config = require("../../config.js");
let publicMethods = require("./PublicMethods.js");
let debug = require('debug')('SQL');
let mysql = require('mysql');


let SQLConnection;

//////////////////////////////////////
                //TEMP//
//////////////////////////////////////

var connected = false;

//////////////////////////////////////
			//Method//
//////////////////////////////////////


var getConnectionStatus = function(){
	return connected;
}
var createConnection = function(callback){
	if(SQLConnection){
		SQLConnection.end(function (err) {
			if(err){
				console.log(err);
			}
			console.log("Pool Closed");
		});

	}
	SQLConnection = mysql.createPool(global.config.database);

	SQLConnection.getConnection(function(err, connection) {
		if (err){
			SQLConnection.end(function (err) {
				if(err){
					console.log(err);
				}
				console.log("Pool Closed");
			});
			connected = false;
			callback(false);
			// throw err;
		}   else {
			fs.readFile(path.join(__dirname,'../db/Company.sql'), 'utf8', async function(err, contents) {
				// console.log(contents);
				await SQLQuery("CREATE DATABASE IF NOT EXISTS Company");
				await SQLQuery(contents);
				connected = true;
				callback(true);
			});

		}

	});

}
//////////////////////////////////////
        //CONTENT START//
//////////////////////////////////////

// Update Database If Exit
var SQLUpdateIfExist = function (db,field,where){
    SQLCheckExist(db, where, function(ifExist){
        if(ifExist){
        	console.log('exist')
            SQLSetField(db, field, where);
        }   else    {
            SQLAdd(db, field);
        }
    })
};

// Promise Update
var SQLUpdateIfExistAsync = async function(db,field,where) {
	let ifExist = await SQLCheckExistAsync(db, where);
	if (ifExist) {
		await SQLSetFieldAsync(db, field, where);
	} else {
		await SQLAdd(db, field);
	}
}

// Check Column Exist
var SQLCheckExistAsync = async function(db, where){
	let sql = "SELECT 1 FROM " +  db  + parseWhere(where);
	console.log(sql);
	return new Promise((resolve, reject) => {
		SQLConnection.query(sql, function(err, data) {
			debug("[%s] " + sql, publicMethods.getDateTime());
			if(err){
				debug("[*******ERROR*******] [%s] ", err);
				reject(false);
			}   else    {
				if(data && (data.length > 0)){
					resolve(true);
				}	else	{
					resolve(false);
				}
			}
		})

	});

};

// Check Column Exist
var SQLCheckExist = function(db, where, callback){
    let sql = "SELECT 1 FROM " +  db  + parseWhere(where);
    SQLConnection.query(sql, function(err, data) {
        debug("[%s] " + sql, publicMethods.getDateTime());
        if(err){
            debug("[*******ERROR*******] [%s] ", err);
            callback(false);
        }   else    {
            if(data && (data.length > 0)){
                callback(true);
            }	else	{
                callback(false);
            }
        }
    })
};

// Count Column
var SQLCount = function(db, where, callback){
    let sql = "SELECT count(*) AS count FROM " +  db  + parseWhere(where);
    SQLConnection.query(sql, function(err, data) {
        debug("[%s] " + sql, publicMethods.getDateTime());
	    if(err){
		    debug("[*******ERROR*******] [%s] ", err);
		    callback([]);
	    }   else    {
		    if(data && (data.length > 0)){
			    callback(parseInt(data.count));
		    }	else	{
			    callback(0);
		    }
	    }
    })
};

// ADD Column
var SQLAdd = async function (db,sqlData){
    var keys = [],
        values = [],
        sql;
    for (var key in sqlData){
        keys.push(key);
		if((typeof sqlData[key]) === "string"){
			values.push(sqlData[key]);
		}   else    {
			values.push(sqlData[key]);
		}

    }
    sql = 'INSERT INTO ' + db + " (" + keys.join(",") + ")" + ' VALUES ("' + values.join('" , "') + '")';
	console.log(sql);
    return new Promise((resolve, reject) => {
        SQLConnection.query(sql,function(err, data){
            debug("[%s] " + sql, publicMethods.getDateTime());

            if(err){
                console.log(err);
                debug("[*******ERROR*******] [%s] ", err);
                reject(true);
            }   else    {
	            resolve(data.insertId);
            }


        });
    })


};

// Find one Column
var SQLFindAdvanced = function(db,field,where,order,callback){
	var sql = "SELECT " + parseField(field) + " FROM " +  db  + parseWhere(where);
	if (order !== "" && order !== null){
		sql += " ORDER BY " + order
	}
	SQLConnection.query(sql, function(err, data) {
		debug("[%s] " + sql, publicMethods.getDateTime());
		if(err){
			debug("[*******ERROR*******] [%s] ", err);
			callback(false);
		}   else    {
			if(data.length > 0){
				callback(data[0]);
			}	else	{
				callback(false);
			}
		}
	})
};

// Find One Column
var SQLFind = function(db,field,where,callback){
    var sql = "SELECT " + parseField(field) + " FROM " +  db  + parseWhere(where);
    SQLConnection.query(sql, function(err, data) {
        debug("[%s] " + sql, publicMethods.getDateTime());
        if(err){
            debug("[*******ERROR*******] [%s] ", err);
            callback(false);
        }   else    {
            if(data.length > 0){
                callback(data[0]);
            }	else	{
                callback(false);
            }
        }
    })
};

// Find one Column
var SQLFindAsync = async function(db,field,where,order,group){
	var sql = 'SELECT ' + parseField(field) + ' FROM ' +  db  + parseWhere(where);
	console.log(sql);
	if (order){
		sql += " ORDER BY " + order
	}
	return new Promise((resolve, reject) => {
        SQLConnection.query(sql, function(err, data) {
            debug("[%s] " + sql, publicMethods.getDateTime());
            if(err){
                console.log(err)
                debug("[*******ERROR*******] [%s] ", err);
                reject(false);
            }   else    {
                if(data.length > 0){
                    resolve(data[0]);
                }	else	{
                    resolve(false);
                }
            }

        })
	});


};

// COUNT Column
var SQLCountAsync = async function(db, where){
	let sql = "SELECT count(*) AS count FROM " +  db  + parseWhere(where);
	return new Promise((resolve, reject) => {
		SQLConnection.query(sql, function(err, data) {
			debug("[%s] " + sql, publicMethods.getDateTime());
			if(err){
				debug("[*******ERROR*******] [%s] ", err);
				reject(err);
			}   else    {
				if(data){

					resolve(parseInt(data[0].count));
				}	else	{
					resolve(0);
				}
			}

		})
	})

}

// Set Column Field
var SQLSetFieldAsync = async function(db,field,where){
	var sql = 'UPDATE ' + db + ' SET ' + parseField(field) + parseWhere(where);
	console.log(sql);
	return new Promise((resolve, reject) => {
		SQLConnection.query(sql,function(err){
			debug("[%s] " + sql, publicMethods.getDateTime());
			resolve(true);
			if(err){
			    reject(false);
			    console.log(err);
				debug("[*******ERROR*******] [%s] ", err);
			}
		});
    })
}

// SET Column
var SQLSetField = function (db,field,where){

    var sql = 'UPDATE ' + db + ' SET ' + parseField(field) + parseWhere(where);

    SQLConnection.query(sql,function(err){
        debug("[%s] " + sql, publicMethods.getDateTime());
        if(err){
            debug("[*******ERROR*******] [%s] ", err);
        }
    });
};

// Regular Select
var SQLSelect = function(db,field,where,order,callback){

    var sql = "SELECT " + parseField(field) + " FROM " +  db  + parseWhere(where);
	// console.log(sql)
    if (order !== "" && order !== null){
        sql += " ORDER BY " + order
    }
	// console.log(sql)
    SQLConnection.query(sql, function(err, data) {
        if(err){
            debug("[*******ERROR*******] [%s] ", err);
            callback([]);
        }   else {
            if(data.length > 0){
                callback(data);
            }	else	{
                // console.log(sql);
                callback([]);
            }
        }

    });


};

// Do Raw SQL
var SQLQuery = async function(sql){
	return new Promise((resolve, reject) => {
		SQLConnection.query(sql, function(err, data) {
			if(err){
				console.log(err)
				debug("[*******ERROR*******] [%s] ", err);
				reject([]);
			}   else {
				if(data.length > 0){
					resolve(data);
				}	else	{
					// console.log(sql);
					resolve(false);
				}
			}

		});
	})
}

// Regular Select
var SQLSelectAsync = async function(db,field,where,order,additional){
	if(!additional){
		additional = '';
	}
	var sql = "SELECT " + parseField(field) + " FROM " +  db  + parseWhere(where);

	if (order !== "" && order !== null){
		sql += " ORDER BY " + order
	}
	sql += " " + additional
	console.log(sql);
	return new Promise((resolve, reject) => {
		SQLConnection.query(sql, function(err, data) {
			if(err){
				console.log(err)
				debug("[*******ERROR*******] [%s] ", err);
				reject([]);
			}   else {
				if(data.length > 0){
					resolve(data);
				}	else	{
					// console.log(sql);
					resolve([]);
				}
			}

		});
	})



};

// Parse Field Set Inc
var parseIncField = function(fields, inc){
	console.log(fields  + ' = ' + (inc >= 0) ? " + " + inc : " - " + Math.abs(inc));
	if(fields){
		var SQLIncField = "";
		var separator = ",";
		if(fields && typeof fields === 'object'){
			var tempFields = [];
			for (var key in fields) {
				if(fields[key] >= 0){
					tempFields.push(key + ' = ' + key + ' + ' + parseInt(fields[key]));
				}   else    {
					tempFields.push(key + ' = ' + key + ' - ' + Math.abs(parseInt(fields[key])));
				}
			}
			SQLIncField = tempFields.join(separator);
		}	else	{
			SQLIncField = fields  + ' = ' + fields  + ((inc >= 0) ? " + " + inc : " - " + Math.abs(inc));
		}
		return SQLIncField;
	}	else    {
		return "";
	}
}

// Inc Certain Field
var SQLSetIncAsync = function (db,field,where,inc){


	var sql = 'UPDATE ' + db + ' SET ' + parseIncField(field, inc) + parseWhere(where);

	console.log(parseIncField(field, inc));
	return new Promise((resolve, reject) => {
		SQLConnection.query(sql,function(err){
			if(err){
				console.log(err)
				debug("[*******ERROR*******] [%s] ", err);
				reject(false);
			}   else {
				resolve(true);
			}

		});
	})


    //publicMethods.eventLog(sql , "SQL");

};

// Get Single Field
var SQLGetField = function(db,field,where,callback){
    var sql = "SELECT " + parseField(field) + " FROM " +  db  + parseWhere(where);

    //publicMethods.eventLog(sql , "SQL");
    SQLConnection.query(sql, function(err, data) {
        debug("[%s] " + sql, publicMethods.getDateTime());
        if(err){
            debug("[*******ERROR*******] [%s] ", err);
            callback([]);
        }   else {
            if (data.length > 0) {
                callback(data[0][field]);
            } else {
                callback("");
            }
        }
    })
};


// Delete
var SQLDelete = async function (db,where){
	var sql = 'DELETE FROM ' + db + parseWhere(where);

	return new Promise((resolve, reject) => {
		SQLConnection.query(sql,function(err){
			if(err){
				console.log(err)
				debug("[*******ERROR*******] [%s] ", err);
				reject(false);
			}   else {
				resolve(true);
			}

		});
	});

};


// Parse Methods
var parseWhere = function(where,separator){
    if(where && where  != "undefined"){
        var SQLWhere = "";
        if(!separator || separator == "undefined"){
            separator = " AND ";
        }

        if(where !== null && typeof where === 'object'){
            var tempWhere = [];
            for (var key in where) {
	            if(Array.isArray(where[key])) {
		            tempWhere.push( key + " IN ('" + where[key].join("', '") + "')")
	            }   else if (typeof where[key] === 'object'){
                    separator = " OR ";
                    for(let fieldkey in where[key]){
                        tempWhere.push( key + " = '" + where[key][fieldkey]+ "'");
                    }

                }   else    {
                    tempWhere.push( key + " = '" + where[key]+ "'");
                }

            }
            SQLWhere = tempWhere.join(separator);
        }	else	{
            SQLWhere = where;
        }
        return " WHERE " + SQLWhere;
    }	else    {
        return "";
    }

};
var parseField = function(field) {
    if(field === null || field === "undefined" || field === ""){
        return " * ";
    }	else if(Array.isArray(field)) {
    	for(let i in field){
		    if((typeof field[key]) === "string"){
			    field[key] = field[key];
	        }
        }
	    return field.join(" , ");
    }	else if(typeof field === 'object') {
	    var SQLField = [];
	    for (var key in field){
		    let tempData = field[key] + "";
		    if((typeof field[key]) === "string"){
			    tempData = field[key];

	        }

            SQLField.push(key + "='" + tempData.replace("'", "\\'") + "' ");
        }
        return SQLField.join(" , ");
    }	else	{
        return field;
    }
};

module.exports = {
    SQLUpdateIfExist: SQLUpdateIfExist,
	SQLUpdateIfExistAsync: SQLUpdateIfExistAsync,
    SQLCheckExist: SQLCheckExist,
	SQLCheckExistAsync: SQLCheckExistAsync,
	SQLCountAsync: SQLCountAsync,
    SQLCount: SQLCount,
    SQLAdd : SQLAdd,
    SQLFind : SQLFind,
	SQLFindAdvanced : SQLFindAdvanced,
	SQLFindAsync : SQLFindAsync,
    SQLSetField : SQLSetField,
	SQLSetFieldAsync : SQLSetFieldAsync,
    SQLSelect : SQLSelect,
	SQLSelectAsync : SQLSelectAsync,
	SQLSetIncAsync : SQLSetIncAsync,
    SQLGetField : SQLGetField,
    SQLDelete : SQLDelete,
	SQLQuery: SQLQuery,
    parseWhere: parseWhere,
    parseField : parseField,
    SQLConnection: SQLConnection,
	createConnection : createConnection,
	connected: connected,
	getConnectionStatus: getConnectionStatus

};

