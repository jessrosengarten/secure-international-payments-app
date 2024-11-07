import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios';

const EmpDashboard = () => {
  const [payments, setPayments] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [paymentToVerify, setPaymentToVerify] = useState(null);
  const [submittedPayments, setSubmittedPayments] = useState({})

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://localhost:443/allPayments', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Fetched payments:', response.data); // Debugging log
        setPayments(response.data);
      } catch (error) {
        console.error('Error fetching payments:', error);
      }
    };

    fetchPayments();
  }, []);

  const verifyPayment = async () => {
    if (paymentToVerify) {
      try {
        const token = localStorage.getItem('token');
        await axios.put(`https://localhost:443/update/${paymentToVerify}`, { status: 'Approved' }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setPayments(payments.map(payment =>
          payment._id === paymentToVerify ? { ...payment, status: 'Approved' } : payment
        ));

        console.log(`Payment ${paymentToVerify} verified`);
      } catch (error) {
        console.error('Error verifying payment:', error);
      } finally {
        setShowConfirmDialog(false);
        setPaymentToVerify(null);
      }
    }
  };

  const handleVerifyClick = (id) => {
    setPaymentToVerify(id);
    setShowConfirmDialog(true);
  }

  const submitToSWIFT = (id, status) => {
    if (status === 'Pending') {
      alert(`Payment needs to be approved first before it can be submitted to SWIFT`);
    } else if (!submittedPayments[id]) {
      alert(`Payment submitted to SWIFT`);
      setSubmittedPayments(prevState => ({ ...prevState, [id]: true }));
    } else {
      alert(`Payment has already been submitted`);
    }
  }

  return ( 
  <div className="dashboard-container">
    {/* Heading */}
    <h1 className="dashboard-heading">INTERNATIONAL BANK</h1>
    <div className="h2-container">
      <h2>Employee Portal</h2>
    </div>
    <div className="payment-container">
      <p>Pending Payments</p>
      {/* Display payments */}
      {payments.length === 0 ? (
        <p>No pending payments to verify.</p>
      ) : (
        <div className="table-container">
          <table className="payment-table">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Currency</th>
                <th>Provider</th>
                <th>Provider Code</th>
                <th>Account Number</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => (
                <tr key={payment._id}>
                  <td>{payment.amount}</td>
                  <td>{payment.currency}</td>
                  <td>{payment.provider}</td>
                  <td>{payment.providerCode}</td>
                  <td>{payment.accountNumber}</td>
                  <td>{payment.status}</td>
                  <td>
                    <div className="button-group">
                      <button onClick={() => handleVerifyClick(payment._id)}>Verify</button>
                      <button onClick={() => submitToSWIFT(payment._id, payment.status)}>Submit to SWIFT</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="account-text">
        <Link to="/login" className="link">Logout</Link>
      </p>
    </div>

    {/* Confirmation Dialog */}
    {showConfirmDialog && (
      <div className="confirm-dialog">
        <div className="confirm-dialog-content">
          <p>Are you sure you want to approve this payment?</p>
          <button className='pay-button' style={{ width: '100px' }} onClick={verifyPayment}>Approve</button>
          <button className='pay-button' style={{ width: '100px' }} onClick={() => setShowConfirmDialog(false)}>Go back</button>
        </div>
      </div>
    )}
  </div>
  );
};

export default EmpDashboard;