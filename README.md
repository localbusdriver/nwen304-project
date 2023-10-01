1.adding database format(manually for items)

{
  "name": "",
  "description": "",
  "price": 1000,
  "image": "/images/product1.png"
}


Basic instruction to setup server::

1.npm init -y   #create Node.js project
2.npm install express ejs body-parser mongoose  #install express module
3.Once server.js is settled then do npm install ejs # to install ejs module

Database setting make sure endpoint is set to 'mongodb://localhost/nwen304'

#How to run the local server
type: node server.js

#Install the jsonwebtoken module using npm
npm install jsonwebtoken

#password hash setup
1.npm install bcrypt

#npm install nodemailer
npm install nodemailer

#Install the express-session module using npm
npm install express-sessione

Steps above are all needed in order to run node server.js else shows you some error

#This is for google login and for registering and verifing
npm install passport passport-google-oauth20 express-session

