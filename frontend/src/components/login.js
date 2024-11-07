import React, { useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import './style.css'
import { usernameRegex, passwordRegex, accountNumberRegex } from './validationHelper';

const Login = () => {
    const [username, setUsername] = useState('')
    const [accountNumber, setAccountNumber] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    // Login function
    const handleLogin = (e) => {
        e.preventDefault()

    // Trim the input values
    const trimmedUsername = username.trim()
    const trimmedAccountNumber = accountNumber.trim()
    const trimmedPassword = password.trim()

    // Validity Check
    if (!usernameRegex.test(trimmedUsername)) {
        alert("Username, accountnumber or password are invalid.");
        return
    }
    if (!accountNumberRegex.test(trimmedAccountNumber)) {
        alert("Username, account number or password are invalid.")
        return
    }
    if (!passwordRegex.test(trimmedPassword)) {
        alert("Username, accountnumber or password are invalid.")
        return
    }

    // Make a POST request to the login endpoint
    axios.post('https://localhost:443/customerLogin', { // navigating to the backend
        userName: trimmedUsername,
        accountNumber: trimmedAccountNumber,
        password: trimmedPassword
    })
            .then(response => {
                // Handle success response
                const { token, message } = response.data
                if (token) {
                    localStorage.setItem('token', token)

                    alert(message)
                    navigate('/customerDashboard')
                } else {
                    alert("Login failed: " + message)
                }
            })
            .catch(error => {
                console.error('Login error:', error)
                alert('Login failed. Please check your credentials or try again later.')
            })
    }

    return (
        <div className="login-container">
            <form onSubmit={handleLogin}>
                {/* Headings */}
                <h1 className="dashboard-heading">INTERNATIONAL BANK</h1>
                <h2>Login</h2>
                <div>
                    <label>Username:</label>
                    <input type="text" value={username} placeholder="Username" onChange={e => setUsername(e.target.value)} className="input-field" />
                </div>
                <div>
                    <label>Account Number:</label>
                    <input type="text" value={accountNumber} placeholder="Account Number" onChange={e => setAccountNumber(e.target.value)} className="input-field" />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} placeholder="Password" onChange={e => setPassword(e.target.value)} className="input-field" />
                </div>
                <button type="submit">Login</button>
                <p className="account-text">Don't have an account? <Link to="/signup" className="link">Signup</Link></p>
            </form>
        </div>
    )
}
export default Login