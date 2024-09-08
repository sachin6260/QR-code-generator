import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react'; // Use QRCodeCanvas for rendering
import { toPng } from 'html-to-image'; // For downloading QR codes
import './QRCodeGenerator.css';

const QRCodeGenerator = () => {
  const [inputValue, setInputValue] = useState('');
  const [qrCode, setQRCode] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('qrHistory')) || [];
    setHistory(storedHistory);
  }, []);

  const isValidURL = (url) => {
    const regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/[\w.-]*)*\/?$/;
    return regex.test(url);
  };

  const generateQRCode = () => {
    if (isValidURL(inputValue)) {
      setQRCode(inputValue);
      addToHistory(inputValue);
    } else {
      alert('Please enter a valid URL');
    }
  };

  const addToHistory = (url) => {
    const newHistory = [...history, url];
    setHistory(newHistory);
    localStorage.setItem('qrHistory', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('qrHistory');
  };

  const downloadQRCode = () => {
    const qrCodeElement = document.getElementById('qrcode');
    toPng(qrCodeElement)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'qrcode.png';
        link.click();
      })
      .catch((error) => {
        console.error('Failed to download QR code:', error);
      });
  };

  const shareQRCode = async () => {
    try {
      const qrCodeElement = document.getElementById('qrcode');
      const dataUrl = await toPng(qrCodeElement);
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "qrcode.png", { type: blob.type });
  
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'QR Code',
          text: 'Check out this QR code!',
          files: [file], // Share the image as a file
        });
      } else {
        alert('Web Share API not supported or unable to share files on your device.');
      }
    } catch (error) {
      console.error('Failed to share QR code:', error);
    }
  };
  

  return (
    <div className="qrcode-generator">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter a URL"
        className="input-field"
      />
      <button onClick={generateQRCode} className="generate-btn">Generate QR Code</button>
      <div className="qr-code-container">
        {qrCode && (
          <div id="qrcode" className="qr-code animated">
            <QRCodeCanvas value={qrCode} size={200} />
          </div>
        )}
      </div>
      {qrCode && (
        <div className="action-buttons">
          <button onClick={downloadQRCode} className="download-btn">Download QR Code</button>
          <button onClick={shareQRCode} className="share-btn">Share QR Code</button>
        </div>
      )}
      <h2>QR Code History</h2>
      {history.length > 0 ? (
        <>
          <ul className="history-list">
            {history.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <button onClick={clearHistory} className="clear-history-btn">Clear History</button>
        </>
      ) : (
        <p>No QR code history available.</p>
      )}
    </div>
  );
};

export default QRCodeGenerator;
