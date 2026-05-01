import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import './ResultCard.css';

const ResultCard = ({ prediction, disclaimer }) => {
    if (!prediction) return null;

    const confidencePercentage = (prediction.confidence * 100).toFixed(1);
    
    // Determine color based on prediction class (Normal is good, others need attention)
    const isNormal = prediction.class.toLowerCase() === 'normal';
    const statusClass = isNormal ? 'status-good' : 'status-attention';

    return (
        <div className="result-card">
            <div className={`result-header ${statusClass}`}>
                {isNormal ? <CheckCircle size={28} /> : <AlertCircle size={28} />}
                <h2>Prediction Result</h2>
            </div>
            
            <div className="result-body">
                <div className="prediction-main">
                    <div className="class-box">
                        <span className="label">Condition</span>
                        <span className="value highlight">{prediction.class}</span>
                    </div>
                    
                    <div className="confidence-box">
                        <span className="label">Confidence</span>
                        <div className="progress-container">
                            <div 
                                className={`progress-bar ${statusClass}`} 
                                style={{ width: `${confidencePercentage}%` }}
                            ></div>
                        </div>
                        <span className="value">{confidencePercentage}%</span>
                    </div>
                </div>
                
                <div className="explanation-box">
                    <Info size={20} className="info-icon" />
                    <p>{prediction.explanation}</p>
                </div>
            </div>
            
            {disclaimer && (
                <div className="disclaimer-box">
                    <strong>Medical Disclaimer: </strong>
                    {disclaimer}
                </div>
            )}
        </div>
    );
};

export default ResultCard;
