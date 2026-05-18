import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, CheckCircle } from 'lucide-react';

const OcrUpload = ({ onDataExtracted }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
    setSuccess(false);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image first.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append('invoice', file);

    try {
      const response = await axios.post('http://localhost:5001/api/ocr', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      onDataExtracted(response.data);
      setSuccess(true);
      setFile(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to process image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ marginBottom: '2rem', border: '2px dashed var(--primary)', background: 'rgba(79, 70, 229, 0.05)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
        <div style={{ background: 'var(--primary)', color: 'white', padding: '1rem', borderRadius: '50%' }}>
          <UploadCloud size={32} />
        </div>
        <h3 style={{ margin: 0 }}>Smart Invoice Scan</h3>
        <p style={{ margin: 0, fontSize: '0.875rem' }}>Upload a receipt or invoice to automatically fill out the expense form.</p>
        
        {error && <p className="text-danger" style={{ fontSize: '0.875rem', margin: 0 }}>{error}</p>}
        {success && <p className="text-success" style={{ fontSize: '0.875rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CheckCircle size={16}/> Data extracted successfully!</p>}
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' }}>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            style={{ fontSize: '0.875rem' }}
            id="ocr-upload"
          />
          <button 
            className="btn btn-primary" 
            onClick={handleUpload} 
            disabled={loading || !file}
          >
            {loading ? 'Processing...' : 'Extract Data'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OcrUpload;
