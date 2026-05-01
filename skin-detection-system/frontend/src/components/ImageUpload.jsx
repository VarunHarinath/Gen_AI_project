import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import './ImageUpload.css';

const ImageUpload = ({ onImageSelect, selectedImage, clearImage }) => {
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFile = (file) => {
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg')) {
            onImageSelect(file);
        } else {
            alert('Please upload a valid JPG or PNG image.');
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    return (
        <div className="upload-container">
            {!selectedImage ? (
                <div 
                    className={`drop-zone ${isDragging ? 'dragging' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleChange} 
                        accept=".jpg,.jpeg,.png" 
                        className="hidden-input"
                    />
                    <Upload className="upload-icon" size={48} />
                    <h3>Click or Drag Image Here</h3>
                    <p>Supports JPG, JPEG, PNG</p>
                </div>
            ) : (
                <div className="preview-container">
                    <img 
                        src={URL.createObjectURL(selectedImage)} 
                        alt="Preview" 
                        className="image-preview" 
                    />
                    <button className="clear-btn" onClick={clearImage}>
                        <X size={20} />
                    </button>
                    <div className="file-info">
                        <ImageIcon size={16} />
                        <span>{selectedImage.name}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
