# APDS7311 POEPart 3 README

## About:
This project is web application payment system for an international bank. The system allows customers to register, log in, 
and make secure international payments. Once a payment has been initiated it is processed by bank employees the employee portal.

## Features:
1. Customer Registration and Login:
  - Customers register using their full name, ID number, account number and password.
  - Login requires username, account number and password.
    
2. Customer Portal:
  - Customers can enter payment amounts, choose a currency and select a payment provider.
  - Payment details such as account information and SWIFT codes are captured.
  - Payment histories are recorded and made visible to customers.
    
3. Employee Portal:
  - Employees can access a dedicated portal to review customer payments.
  - They verify account information, validate SWIFT codes and forward payments to the SWIFT system.
  - Only pre-registered employees can log in without the need for registration.

## Employee Login Details
  - Username: Emp001 - Password: Emp001@password
  - Username: Emp002 - Password: Emp002@password

## Security Features:
1. Password Hashing and Salting:
  - Customer passwords are stored using a secure hashing and salting technique, ensuring that sensitive data is protected even
    if the database is compromised.
    
2. Input Validation and Regular Expressions(Regex):
  - Input fields such as account number and SWIFT code are protected using Regex to prevent injection attacks (SQL injection, XSS).
    
3. SSL Encryption:
  - Web traffic is encrypted using SSL with a valid certificate and key, ensuring secure communication between the client and server
    and safeguarding sensitive data while in transit.

## Security Middleware:
  - Express Brute was configured to enhance application security by protecting against brute-force attacks and securing HTTP headers.
  - Checking authorisation and verifying that the user is logged in. CheckAuth middleware is implemented to do this. 
  - XXS was used to sanitise all inputs.
  - Helmet was used to set security-related headers.
  - Morgan was implemented to that logs incoming requests to our application for node.js.

## DevSecOps Pipeline:
  - A basic DevSecOps pipeline has been implemented to trigger security checks and code validation on each code push, ensuring
    continuous security throughout the development lifecycle.
  - Circle-CI pipline was implmented and is triggered with each push. This is used to check for hotspots and code smells.

## Technologies Used:
1. Frontend: Visual Studio Code, React.
2. Backend: Node.js, Express.js.
3. Database: MongoDB.
4. Security Tools: Express Brute, SSL, bcrypt.

## Screentshots of YML files for CircleCI and DevSecOps Pipeline:
![Snyk](https://github.com/user-attachments/assets/44acc4f1-c10e-45a6-bbbb-16846561ab78)
![SonarScan](https://github.com/user-attachments/assets/ce49dfa9-2a28-4221-9d32-74d226adcb23)
![SonarQubeScan](https://github.com/user-attachments/assets/7bacbb55-0e72-4e2b-aeb0-634f54882980)
![SonarCloudWeb](https://github.com/user-attachments/assets/c430e6b5-7d11-4672-b718-448ebaf0a20e)




