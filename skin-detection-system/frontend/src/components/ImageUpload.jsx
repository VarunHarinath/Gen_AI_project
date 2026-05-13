import React, { useRef, useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, X, Camera, SwitchCamera } from 'lucide-react';
import './ImageUpload.css';

const ImageUpload = ({ onImageSelect, selectedImage, clearImage }) => {
    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    
    const [isDragging, setIsDragging] = useState(false);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [stream, setStream] = useState(null);
    const [devices, setDevices] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState('');

    // Fetch available camera devices (useful for USB microscopes)
    const getDevices = async () => {
        try {
            const mediaDevices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = mediaDevices.filter(device => device.kind === 'videoinput');
            setDevices(videoDevices);
            if (videoDevices.length > 0 && !selectedDeviceId) {
                setSelectedDeviceId(videoDevices[0].deviceId);
            }
        } catch (err) {
            console.error("Error enumerating devices:", err);
        }
    };

    useEffect(() => {
        // Cleanup camera stream on unmount
        return () => {
            stopCamera();
        };
    }, []);

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const startCamera = async (deviceIdToUse = selectedDeviceId) => {
        stopCamera(); // Stop any existing stream
        try {
            await getDevices(); // Ensure we have the latest devices (e.g. newly plugged USB)
            
            const constraints = {
                video: deviceIdToUse ? { deviceId: { exact: deviceIdToUse } } : true
            };
            
            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(mediaStream);
            setIsCameraActive(true);
            
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access camera. Please check connections and permissions.");
            setIsCameraActive(false);
        }
    };

    const handleDeviceChange = (e) => {
        const newDeviceId = e.target.value;
        setSelectedDeviceId(newDeviceId);
        if (isCameraActive) {
            startCamera(newDeviceId);
        }
    };

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            
            // Set canvas to actual video dimensions
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
                    stopCamera();
                    setIsCameraActive(false);
                    onImageSelect(file);
                }
            }, 'image/jpeg', 0.95);
        }
    };

    const cancelCamera = () => {
        stopCamera();
        setIsCameraActive(false);
    };

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
            {selectedImage ? (
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
            ) : isCameraActive ? (
                <div className="camera-container">
                    {devices.length > 1 && (
                        <div className="camera-selector">
                            <SwitchCamera size={16} />
                            <select value={selectedDeviceId} onChange={handleDeviceChange}>
                                {devices.map((device, idx) => (
                                    <option key={device.deviceId} value={device.deviceId}>
                                        {device.label || `Camera ${idx + 1}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        className="camera-preview"
                    />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                    <div className="camera-controls">
                        <button className="btn-capture" onClick={captureImage}>
                            <Camera size={20} /> Capture
                        </button>
                        <button className="btn-cancel" onClick={cancelCamera}>
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="upload-actions">
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
                    
                    <div className="divider">
                        <span>OR</span>
                    </div>

                    <button className="btn-start-camera" onClick={() => startCamera()}>
                        <Camera size={20} /> Capture via USB Camera/Microscope
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
