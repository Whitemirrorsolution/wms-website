import React from 'react'
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
// import AuthContext from './context/AuthContext';
// import AdminContext from './context/AdminContext';


ReactDOM.createRoot(document.getElementById('root')).render(

    <BrowserRouter>
    {/* <AuthContext> */}
    {/* <AdminContext> */}
          <App /> 
    {/* </AdminContext> */}
    {/* </AuthContext> */}
    </BrowserRouter>
 
);
