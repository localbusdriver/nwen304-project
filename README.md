🌐 Nwen304 Project

This is URL for the application
https://nwen304-project-oj6vlskeja-ts.a.run.app/

🌍 List of Exposed API
User Registration: /register (GET, POST)
User Login: /login (GET, POST)
User Logout: /logout (POST)
Member Page: /member (GET)
Reset Password: /reset-password (GET, POST)
Set New Password: /new-password (POST)
List Items: /items (GET)
Specific Item Details: /item/:itemId (GET)
Update Specific Item: /item/:itemId (PUT)
Delete Specific Item: /item/:itemId (DELETE)
Add New Item: /item (POST)
Purchase Specific Item: /purchase/:itemId (POST)
Recommended Items: /recommended-items (GET)

🛡️ Fault Tolerance/Error Handling Features
Middleware for Authentication: The ensureAuthenticated middleware ensures that only authenticated users can access certain routes.
Error Handling: In the API routes, errors are caught and logged using console.error, and a 500 Server error response is sent to the client.
Validation: User input is validated before processing to ensure data integrity.
Logging: Using morgan, the application logs all incoming requests, which can be useful for debugging and monitoring.


🚀 Project Setup
📦 Installing Required Libraries
Run the following commands to install the necessary libraries for the project:

npm install bcryptjs express-validator  

npm install ejs

npm install mongoose

npm install passport passport-google-oauth20

npm install express body-parser express-session      

npm install dotenv

npm install middleware

npm install axios  //this is for API gateway

npm install cors

npm install nodemailer

npm install node-fetch

🔍 Test Setup
⚡ Performance Testing

1.Install Artillery globally:
npm install -g artillery

2.Run tests using .yml:

artillery run test/config.yml (any yml)

🧪 Unit Testing
1.Install the required libraries for testing:

npm install mocha chai chai-http --save-dev

2.To execute the tests, use the following command:

npx mocha test/authMiddleware.test.js

🔧 Backend Test Scripts
Use the following curl commands to test the backend:

🛂 Login:
curl -X POST -H "Content-Type: application/json" -d "{\"username\":\"John\", \"password\":\"Taichi00610\"}" http://localhost:3000/login

Found. Redirecting to /member

📝 Register:
curl -X POST -H "Content-Type: application/json" -d "{\"username\":\"newuser\", \"password\":\"newpassword\", \"email\":\"newuser@example.com\"}" http://localhost:3000/register

🔍 Fetch Specific Item:
curl -X GET http://localhost:3000/item/1

✏️ Update Specific Item: 
curl -X PUT -H "Content-Type: application/json" -d "{"name":"Updated Apple", "description":"Updated description"}" http://localhost:3000/item/1

❌ Delete Specific Item:
curl -X DELETE http://localhost:3000/item/1

➕ Add New Item:
curl -X POST -H "Content-Type: application/json" -d "{"name":"Mango", "description":"Tropical fruit", "image":"path_to_mango.jpg"}" http://localhost:3000/item

🛍️ Purchase Specific Item:
curl -X POST http://localhost:3000/purchase/1

📚 Database Design Summary

In this project, we utilize mongoose to interact with the MongoDB database.

User Model
username: The name of the user.
email: The email address of the user.
password: The password of the user (stored in an encrypted format).
resetToken: A temporary token for password reset.
resetTokenExpiration: The expiration date of the reset token.
location: The location information of the user (used for recommendations).
purchaseHistory: The history of items purchased by the user.

This model is used to support functionalities such as user registration, login, and password reset.

🔍 Caching Header Test Cases using PowerShell

Verify Cache-Control Header:

$headers = Invoke-WebRequest -Uri http://localhost:3000/item/1 -Method Head | Select-Object -ExpandProperty Headers
$headers['Cache-Control']

output:public, max-age=3600

Verify Expires Header:

$headers = Invoke-WebRequest -Uri http://localhost:3000/item/1 -Method Head | Select-Object -ExpandProperty Headers
$headers['Expires']

output:Tue, 24 Oct 2023 12:30:23 GMT

Verify Last-Modified or ETag Header:

$headers = Invoke-WebRequest -Uri http://localhost:3000/item/1 -Method Head | Select-Object -ExpandProperty Headers
$headers['Last-Modified']

output:Tue, 24 Oct 2023 11:30:45 GMT

Test for ETag:

$headers = Invoke-WebRequest -Uri http://localhost:3000/item/1 -Method Head | Select-Object -ExpandProperty Headers
$headers['ETag']

output:W/"71-H0IKY7R1jhNj7sup6RXsVYTDWSI"




