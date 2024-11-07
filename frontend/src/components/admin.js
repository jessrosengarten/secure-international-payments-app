import React, { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import './style.css'
import { empNumberRegex, passwordRegex } from './validationHelper'

const EmpLogin = () => {
    const [empNumber, setEmpNumber] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleEmpNumberChange = (e) => {
        setEmpNumber(e.target.value)
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }

    // Employee Login
    const handleEmployeeLogin = (e) => {
        e.preventDefault();
        
        // Trim the input values
        const trimmedEmpNumber = empNumber.trim();
        const trimmedPassword = password.trim();

        // Validate input fields
        if (!empNumberRegex.test(trimmedEmpNumber)) {
            alert("Employee Number is invalid.")
            return
        }
        if (!passwordRegex.test(trimmedPassword)) {
            alert("Password is invalid.");
            return
        }

        // Make API request for employee login
        axios.post('https://localhost:443/employeeLogin', {
            empNumber: trimmedEmpNumber,
            empPassword: trimmedPassword
        })
            .then(response => {
                const token = response.data.token;
                localStorage.setItem('token', token);
                alert(response.data.message);
                navigate('/empDashboard'); // Navigate to employee dashboard
            })
            .catch(error => {
                console.error('Employee login failed', error);  // Log error
                alert('Error logging in. Please check your credentials.');
            });
    };

    return (
        <div className="login-container">
            <form onSubmit={handleEmployeeLogin}>
                {/* Headings */}
                <h1 className="dashboard-heading">INTERNATIONAL BANK</h1>
                <h2>Employee Login</h2>

                {/* Employee Number Input */}
                <div>
                    <label>Employee Number:</label>
                    <input
                        type="text"
                        value={empNumber}
                        placeholder="Employee Number"
                        onChange={handleEmpNumberChange}
                        className="input-field"
                    />
                </div>

                {/* Password Input */}
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        placeholder="Password"
                        onChange={handlePasswordChange}
                        className="input-field"
                    />
                </div>

                {/* Submit Button */}
                <button type="submit">Login</button>

            </form>
        </div>
    );
};

export default EmpLogin;
