const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const { client } = require('./DB/db')
const db = client.db('Customer')
const db2 = client.db('Payments')
const db3 = client.db('Employee')
const bcrypt = require('bcrypt')
const jwToken = require('jsonwebtoken')
const ExpressBrute = require('express-brute')
const store = new ExpressBrute.MemoryStore()
const bruteforce = new ExpressBrute(store)
const Customer = require('./Models/customer')
const Employee = require('./Models/employee')
const Payment = require('./Models/payments')
const { ObjectId } = require('mongodb')
const checkAuth = require('./checkAuth.js')
const xss = require('xss')
const helmet = require('helmet');
const morgan = require('morgan');
app.use(morgan('dev'));
app.use(cors())
app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/signup', bruteforce.prevent, async (req, res) => {

    try {
        //Declaring variables and sanitizing the inputs with xss
        const fullName = xss(req.body.fullName)
        const userName = xss(req.body.userName)
        const idNumber = xss(req.body.idNumber)
        const accountNumber = xss(req.body.accountNumber)
        const password = xss(req.body.password)

        //Checking if all fields are entered
        if (!fullName || !userName || !idNumber || !accountNumber || !password) {
            return res.status(401).send('Please fill in all fields')
        }

        //Checks if the username already exists
        const usernameExists = await db.collection('Customer').findOne({ userName: userName })
        if (usernameExists) {
            return res.status(401).send('Username is already taken')
        }

        const accountNumberExists = await db.collection('Customer').findOne({ accountNumber: accountNumber })
        if (accountNumberExists) {
            return res.status(401).send('Invalid account number')
        }

        //Hashing and salting the password
        const passwordHash = await bcrypt.hash(req.body.password, 10)

        //Creating a new customer
        let newCustomer = new Customer({ fullName, userName, idNumber, accountNumber, password: passwordHash.toString() })
        await db.collection('Customer').insertOne(newCustomer)

        //Welcome message to the customer
        res.status(201).send('Signup Successful')

    } catch (error) {
        res.status(401).send('Error signing up')
    }

})

app.post('/EmpSignup', async (req, res) => {

    try {
        //Declaring variables and sanitizing the inputs with xss
        const empNumber = xss(req.body.empNumber)
        const empPassword = xss(req.body.empPassword)

        //Hashing and salting the password
        const passwordHash = await bcrypt.hash(empPassword, 10)

        //Creating a new employee
        let newEmp = new Employee({ empNumber, empPassword: passwordHash.toString() })
        await db3.collection('Employee').insertOne(newEmp)

        //Welcome message to the employee
        res.status(201).send(`Welcome ${newEmp.empNumber}`)

    } catch (error) {
        res.status(401).send('Error signing up')
    }

})

// login for customer
app.post('/customerLogin', bruteforce.prevent, async (req, res) => {
    try {
        //Declaring variables and sanitizing the inputs with xss
        const userName = xss(req.body.userName)
        const accNum = xss(req.body.accountNumber)
        const password = xss(req.body.password)

        let customer = await db.collection('Customer').findOne({ userName: userName }) // finding username. 

        if (!customer) { // checking is customer exists 
            return res.status(401).send({ message: 'Check your UserName, Account Number or password' }) // error message
        }

        const isPasswordValid = await bcrypt.compare(password, customer.password) // checking is password match
        const sanitizedAccountNumber = xss(customer.accountNumber); // sanitizing account number
        const isAcountNumValid  = accNum === sanitizedAccountNumber; // checking is account number match

        if (!isPasswordValid || !isAcountNumValid) { // if password and account  number not match 
            return res.status(401).send({ message: 'Check your UserName, Account Number or password' }) // error message
        }
        else { //  if password and account number match 
            const token = jwToken.sign({ userName: customer.userName, accNum: customer.accountNumber }, 'Thisisthestringwewilluseforouttoken.TheLongerthestringmorecomplicated', { expiresIn: '1h' }) // creating a token
            res.status(200).json({ message: 'Welcome ' + userName, token: token }) // welcome message
        }
    }
    catch (err) { // if an error occurs. 
        res.status(401).json({ message: 'Failed Login Attempt' })
    }
})

// login for employee
app.post('/employeeLogin', bruteforce.prevent, async (req, res) => {
    try {
        //Declaring variables and sanitizing the inputs with xss
        const empNumber = xss(req.body.empNumber)
        const empPassword = xss(req.body.empPassword)
        let employee = await db3.collection('Employee').findOne({ empNumber: empNumber }) // finding username. 

        if (!employee) { // checking is employee exists 
            return res.status(401).send({ message: 'Check your Employee Number or password' }) // error message
        }

        const isEmpPasswordValid = await bcrypt.compare(empPassword, employee.empPassword) // checking is password match

        if (!isEmpPasswordValid) { // if password and account  number not match 
            return res.status(401).send({ message: 'Check your Employee Number or password' }) // error message
        }
        else { //  if password and account number match 
            const token = jwToken.sign({ empNumber: employee.empNumber }, 'Thisisthestringwewilluseforouttoken.TheLongerthestringmorecomplicated', { expiresIn: '1h' }) // creating a token
            res.status(200).json({ message: 'Welcome ' + empNumber, token: token }) // welcome message
        }
    }
    catch (err) { // if an error occurs. 
        res.status(401).json({ message: 'Failed Login Attempt' })
    }
})


app.post('/payments', checkAuth, async (req, res) => {
    try {
        //Declaring variables and sanitizing the inputs with xss
        const accountNumber = xss(req.body.accountNumber)
        const amount = xss(req.body.amount)
        const currency = xss(req.body.currency)
        const provider = xss(req.body.provider)
        const providerCode = xss(req.body.providerCode)

        const accNumber = req.accountNumber;
        if (accountNumber !== accNumber) {
            return res.json({ message: 'Account number does not match' })
        }
        //Check if all fields are entered
        if (!accountNumber || !amount || !currency || !provider) {
            return res.json({ message: 'Please fill in all fields' })
        }
        else {
            //Creating a new payment
            const newPayment = new Payment({ accountNumber, amount, currency, provider, providerCode, status: 'Pending' })
            //Inserts payment into the database
            await db2.collection('Payments').insertOne(newPayment)
            res.json({ message: 'Payment is being reviewed before approval' })
        }
    } catch (error) {
        res.json({ success: false, message: 'Error creating payment' })
    }

})

// update function 
app.put('/update/:id', checkAuth, async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id) } // getting the  id from the url
        const update = {
            $set: {
                status: req.body.status
            } // updated query
        }
        let result = await db2.collection('Payments').updateOne(query, update) // updating the query on the database
        res.send(result).status(201) // sending the result 
    }
    catch (error) {
        res.json({ success: false, message: 'Error in updating payment status' })
    }
})

// getting all payments from database
app.get('/allPayments', checkAuth, async (req, res) => {
    try {
        let results = await db2.collection("Payments").find({}).toArray() // getting payments and putting them into an array
        res.status(200).send(results); // setting status and displaying results
    } catch (error) {
        res.status(500).send('Internal server error')
    }
});

app.get('/customerPayments', checkAuth, async (req, res) => {
    try {
        //Getting the account number
        const accountNumber = req.accountNumber
        //Finding the payments for the account number
        const paymentsCursor = await db2.collection("Payments").find({ accountNumber: accountNumber })
        //Converting the cursor to an array
        const payments = await paymentsCursor.toArray()

        //If no payments were found for the account number display a message
        if (payments.length === 0) {
            return res.status(404).send("No payments were found for this account number")
        }
        //Sendign the array of payments
        res.json(payments)
    } catch (error) {
        //If an error occurs display an error message
        res.status(500).send('Server error')
    }
});

module.exports = app