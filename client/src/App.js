import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import Footer from "./components/layouts/Footer";
import Navbar from "./components/layouts/Navbar";
import Landing from "./components/layouts/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";


import './App.css';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Route exact path="/" component={Landing} />
        <div className="container">
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />

        </div>
      </div>

    </Router>
  );
}

export default App;
