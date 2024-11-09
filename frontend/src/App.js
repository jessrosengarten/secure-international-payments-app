//import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signup from "./components/signup";
import Login from "./components/login";
import CustomerDashboard from "./components/customerDashboard";
import EmpLogin from './components/admin';
import EmpDashboard from "./components/empDashboard";
import './App.css';

function App() {
  useEffect(() => {
    localStorage.removeItem('token');
  }, []);
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/customerDashboard' element={<CustomerDashboard />} />
          <Route path='/admin' element={<EmpLogin />} />
          <Route path='/empDashboard' element={<EmpDashboard />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
