//Declare port number
const PORT = 443
const http = require('https')
const fs = require('fs')
const now = new Date()
const current = now.toLocaleString();
const app = require('./index')

//Creating a server
const server = http.createServer({
    key: fs.readFileSync('Keys/privatekey.pem'),
    cert: fs.readFileSync('Keys/certificate.pem')
}, app)

const { connect } = require('./DB/db')
connect()

//Listening to the server
server.listen(PORT, () => {
    console.log(`Server started on port: ${PORT} @ ${current}`)
});