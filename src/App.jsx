import React from 'react';
import QRCodeGenerator from './components/QRCodeGenerator';
import './App.css';

const App = () => {
  return (
    <div className="app-container">
      <h1>QR Code Generator</h1>
      <QRCodeGenerator />
    </div>
  );
};

export default App;
