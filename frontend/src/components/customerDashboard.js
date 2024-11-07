import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"
import './style.css'
import { accountInfoRegex, amountRegex, providerCodeRegex } from './validationHelper'

const CustomerDashboard = () => {
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('ZAR');
    const [provider, setProvider] = useState('SWIFT');
    const [showAccountInfo, setShowAccountInfo] = useState(false);
    const [accountInfo, setAccountInfo] = useState('');
    const [providerCode, setProviderCode] = useState('');
    const navigate = useNavigate()
    const [paymentHistory, setPaymentHistory] = useState([]);
    const token = localStorage.getItem('token');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log(token);
        if (token) {
            axios.get('https://localhost:443/customerPayments', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    setPaymentHistory(response.data); // displaying the customers payments 
                })
                .catch(error => {
                    console.error('Error fetching payment history', error);
                });
        }
    }, []);
    const handleNext = () => {

        setErrors({}) // Clear previous errors

        // Validate payment amount
        if (!amountRegex.test(amount)) {
            setErrors(prevErrors => ({ ...prevErrors, amount: "Amount must be a valid number." }));
            return;
        }

        setShowAccountInfo(true) // Show Account Information section
    };

    const handlePayment = (e) => {
        e.preventDefault()

        if (!accountInfoRegex.test(accountInfo)) {
            alert("Account number is invalid.");
            return;
        }
        if (!providerCodeRegex.test(providerCode)) {
            alert("Provider code is invalid.");
            return;
        }
        if (!amountRegex.test(amount)) {
            alert("Amount is invalid.");
            return;
        }
        axios.post('https://localhost:443/payments', {
            accountNumber: accountInfo,
            amount: amount,
            currency: currency,
            provider: provider,
            providerCode: providerCode
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                alert(response.data.message);
                navigate('/customerDashboard')
            })
            alert(`Payment processed.\nAccount: ${accountInfo}\nProvider Code: ${providerCode}`);
        setShowAccountInfo(false); // Reset back to Payments section after the payment is processed
    };

    return (
        <div className="main-container">
            <h1 className="dashboard-heading">INTERNATIONAL BANK</h1>

            {/* Conditionally render based on showAccountInfo state */}
            {!showAccountInfo ? (
                <div className="merged-container">
                    {/* Payment History Section */}
                    <div className="payment-history">
                        <h2>Payment History</h2>
                        <ul className="payment-history-list">
                            {paymentHistory.map((payment) => (
                                <li key={payment.id}>
                                    <p>Amount: {payment.amount} {payment.currency}</p>
                                    <p>Provider: {payment.provider}</p>
                                    <p>Status: {payment.status}</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Payment Form Section */}
                    <div className="payment-form">
                        <h2>Payments</h2>
                        <label>Payment Amount</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        {errors.amount && <div style={{ color: 'red' }}>{errors.amount}</div>}

                        <label>Select Currency</label>
                        <select
                            className="dropdown"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                        >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="ZAR">ZAR</option>
                            <option value="GBP">GBP</option>
                        </select>

                        <label>Select Payment Provider</label>
                        <select
                            className="dropdown"
                            value={provider}
                            onChange={(e) => setProvider(e.target.value)}
                        >
                            <option value="SWIFT">SWIFT</option>
                        </select>

                        <button className="action-button" onClick={handleNext}>
                            Next
                        </button>
                        <p className="account-text">
                            <Link to="/login" className="link">Logout</Link>
                        </p>
                    </div>
                </div>
            ) : (
                <div className="account-info-section">
                    <h2>Account Information</h2>

                    <label>Account Information</label>
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Enter account information"
                        value={accountInfo}
                        onChange={(e) => setAccountInfo(e.target.value)}
                    />
                    {errors.accountInfo && <div style={{ color: 'red' }}>{errors.accountInfo}</div>} {/* Display account info error */}

                    <label>Provider Code</label>
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Enter provider code"
                        value={providerCode}
                        onChange={(e) => setProviderCode(e.target.value)}
                    />
                    {errors.providerCode && <div style={{ color: 'red' }}>{errors.providerCode}</div>} {/* Display provider code error */}

                    {/* Pay Now Button */}
                    <button className="action-button" onClick={handlePayment}>
                        Pay Now
                    </button>

                    <div className="button-link">
                        <p className="account-text">
                            <button onClick={() => setShowAccountInfo(false)} className="styled-button">
                                Back to Payments
                            </button>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerDashboard;
