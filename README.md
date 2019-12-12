# Thristram Employee Management System

> The purpose of this online management system is to create a simple-to-use employee management system, which can add, update and delete employee profile into the system. 

## Environment

NodeJS v10.x

NPM (Usually come with NodeJS installation)

MySQL Server v5.7 (Currently do not compatible with v8.x due to new authentication method)

Detail on how to install NodeJS and MySQL Server can be found here.

https://nodejs.org/en/download/package-manager

https://dev.mysql.com/downloads/mysql/5.7.html

## Dependencies

First 'cd' to the root directory, then do the following to install dependencies.

```sh
npm install
```

## Start the App
Do the following command and follow instructions. You may need to present a MySQL server credential to proceed. Please allow this MySQL user to create, insert, update and select the Company database and Employee table. Please make sure that the project directory is writable.

```sh
node PROJECT_ROOT_DIECTORY/bin/www
```

The app will be listening to port 3001, so if running on localhost, the address may be 

```sh
http://localhost:3001/
```

## Demo
A demo website can be found at http://employee.thristram.com (Sorry, no https access, because it is expensive to buy a https cretificate)

This demo is deployed on Amazon Web Services EC2. Database on Amazon Aurora. Together with Application Load Balancer and Auto Scaling to form a scalable architecture.
