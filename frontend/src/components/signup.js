import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import './style.css'
import { fullNameRegex, usernameRegex, idNumberRegex, accountNumberRegex, passwordRegex } from './validationHelper'

const Signup = () => {
    const [fullName, setFullName] = useState('');
    const [userName, setUserName] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSignup = (e) => {
        e.preventDefault()

        // Trim the end of the input values
        const trimmedUserName = userName.trimEnd()
        const trimmedIdNumber = idNumber.trimEnd()
        const trimmedAccountNumber = accountNumber.trimEnd()
        const trimmedPassword = password.trimEnd()

        // Validation checks before submission
        if (!fullNameRegex.test(fullName)) {
            setErrorMessage("Full Name is invalid. Please enter at least 2 characters and avoid using numbers.")
            return;
        }
        if (!usernameRegex.test(trimmedUserName)) {
            setErrorMessage("Username is invalid. Use 3-15 characters, only letters, numbers, or underscores.")
            return;
        }
        if (!idNumberRegex.test(trimmedIdNumber)) {
            setErrorMessage("ID Number must be exactly 13 digits.")
            return;
        }
        if (!accountNumberRegex.test(trimmedAccountNumber)) {
            setErrorMessage("Account Number must be exactly 10 digits.")
            return;
        }
        if (!passwordRegex.test(trimmedPassword)) {
            setErrorMessage("Password must be 8-18 characters including capatalised and uncapatalised letters, numbers, and special characters.")
            return;
        }

        // Submit the signup request if all inputs are valid
        axios.post('https://localhost:443/signup', {
            fullName,
            userName: trimmedUserName,
            idNumber: trimmedIdNumber,
            accountNumber: trimmedAccountNumber,
            password: trimmedPassword
        })
            .then(response => {
                alert(response.data);
                navigate('/login');
            })
            .catch(error => {
                console.error('Error with the signup', error);
                setErrorMessage(error.response?.data || 'There was an error signing up. Try again later');
            });
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSignup}>
                {/* Heading Section */}
                <h1 className="dashboard-heading">INTERNATIONAL BANK</h1>
                <h2>Sign Up</h2>
                <div>
                    <input
                        type="text"
                        value={fullName}
                        placeholder="Full Name"
                        onChange={e => setFullName(e.target.value)}
                        className="input-field"
                    />
                </div>
                <div>
                    <input
                        type="text"
                        value={userName}
                        placeholder="Username"
                        onChange={e => setUserName(e.target.value)}
                        className="input-field"
                    />
                </div>
                <div>
                    <input
                        type="text"
                        value={idNumber}
                        placeholder="ID Number"
                        onChange={e => setIdNumber(e.target.value)}
                        className="input-field"
                    />
                </div>
                <div>
                    <input
                        type="text"
                        value={accountNumber}
                        placeholder="Account Number"
                        onChange={e => setAccountNumber(e.target.value)}
                        className="input-field"
                    />
                </div>
                <div>
                    <input
                        type="password"
                        value={password}
                        placeholder="Password"
                        onChange={e => setPassword(e.target.value)}
                        className="input-field"
                    />
                </div>
                <button type="submit">Sign Up</button>
                <p className="account-text">
                    <Link to="/login" className="link">Return to Login</Link>
                </p>
                {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            </form>
        </div>
    )
}

export default Signup;