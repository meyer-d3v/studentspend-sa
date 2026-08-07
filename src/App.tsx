import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ErrorBoundary from './assets/frontend/components/ErrorBoundary';
import MainLayout from './assets/frontend/components/MainLayout';
import RegisterLayout from './assets/frontend/components/RegisterLayout';
import Login from './assets/frontend/pages/login';
import Dashboard from './assets/frontend/pages/dashboard';
import LandingPage from './assets/frontend/pages/landingPage';
import Budget from './assets/frontend/pages/RegistrationWorkflow/budget';
import BudgetPlanner from './assets/frontend/pages/budgetPlanner';
import Alerts from './assets/frontend/pages/alerts';
import Expenses from './assets/frontend/pages/expenses';
import Reports from './assets/frontend/pages/reports';
import Account from './assets/frontend/pages/RegistrationWorkflow/account';
import Details from './assets/frontend/pages/RegistrationWorkflow/details';
import Finish from './assets/frontend/pages/RegistrationWorkflow/finish';
import Income from './assets/frontend/pages/RegistrationWorkflow/income';
import Verification from './assets/frontend/pages/RegistrationWorkflow/verification';
import { useContext } from './assets/backend/useContext/user';
import './App.css'



function App() {

  const location = useLocation();

  function getAuthDetails() {

    const user = useContext();

    if (user === null) {

      console.log("User not logged in. unauthorized access")
      //replace("./");

    }

  }
  
  useEffect(() => {
    // This code block runs every single time the route changes
    console.log(`Navigated to: ${location.pathname}`);

    
    getAuthDetails;
    // Insert your custom function logic here
    //myCustomFunction(); 
  }, [location]); // Triggers when the location object updates


  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        
        <Route 
          element={
            <ErrorBoundary>
              <RegisterLayout />
            </ErrorBoundary>
          }
        >
          <Route path="/account" element={<Account/>} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/details" element={<Details />} />
          <Route path="/income" element={<Income />} />
          <Route path="/verification" element={<Verification />} />
        </Route>

        <Route path="/finish" element={<Finish />} />


        <Route 
          element={
            <ErrorBoundary>
              <MainLayout />
            </ErrorBoundary>
          }
        >

        <Route path="/dashboard" element={<Dashboard key={location.pathname}/>} />
        <Route path="/budgetplanner" element={<BudgetPlanner />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/reports" element={<Reports />} />
        
        
      </Route>
    </Routes>
  );
}

export default App;