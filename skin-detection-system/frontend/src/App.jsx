import React, { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import ResultCard from './components/ResultCard';
import SupportedClasses from './components/SupportedClasses';
import { predictSkinCondition } from './api';
import { Activity, ScanSearch } from 'lucide-react';
import './App.css';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleImageSelect = (file) => {
    setSelectedImage(file);
    setResult(null);
    setError(null);
  };

  const clearImage = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
  };

  const handlePredict = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await predictSkinCondition(selectedImage);
      if (data.success) {
        setResult({
          prediction: data.prediction,
          disclaimer: data.disclaimer
        });
      } else {
        setError(data.error || 'Prediction failed');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="content-wrapper">
        <header className="app-header">
          <div className="logo-container">
            <ScanSearch size={32} className="logo-icon" />
            <h1>DermaDetect AI</h1>
          </div>
          <p className="subtitle">Advanced AI for visual skin condition analysis</p>
        </header>

        <main className="main-content">
          <div className="card-container">
            <ImageUpload 
              onImageSelect={handleImageSelect} 
              selectedImage={selectedImage} 
              clearImage={clearImage}
            />

            {selectedImage && !result && !loading && (
              <button className="predict-btn" onClick={handlePredict}>
                <Activity size={20} />
                Analyze Image
              </button>
            )}

            {loading && (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Analyzing skin condition...</p>
              </div>
            )}

            {error && (
              <div className="error-container">
                <p>{error}</p>
              </div>
            )}

            {result && (
              <ResultCard 
                prediction={result.prediction} 
                disclaimer={result.disclaimer} 
              />
            )}
          </div>

          <SupportedClasses />
        </main>
      </div>
    </div>
  );
}

export default App;
