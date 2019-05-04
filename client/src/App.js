import React from 'react';
import Footer from "./components/layouts/Footer";
import Navbar from "./components/layouts/Navbar";
import Landing from "./components/layouts/Landing";

import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Landing />
      <Footer />
      
    </div>
  );
}

export default App;
