import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';

const UploadPhotos = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { from, to, date, distance } = location.state || {};
  
  const [photos, setPhotos] = useState([]);
  const [photoDescriptions, setPhotoDescriptions] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const newFiles = Array.from(e.target.files);
    addPhotos(newFiles);
  };


  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const newFiles = Array.from(e.dataTransfer.files);
    addPhotos(newFiles);
  };


  const addPhotos = (newFiles) => {
   
    const imageFiles = newFiles.filter(file => file.type.startsWith('image/'));
  
    const newPhotos = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));

    setPhotos(prevPhotos => [...prevPhotos, ...newPhotos]);
    
   
    setPhotoDescriptions(prevDescriptions => {
      const newDescriptions = [...prevDescriptions];
      for (let i = 0; i < newPhotos.length; i++) {
        newDescriptions.push('');
      }
      return newDescriptions;
    });
  };


  const updateDescription = (index, description) => {
    const newDescriptions = [...photoDescriptions];
    newDescriptions[index] = description;
    setPhotoDescriptions(newDescriptions);
  };

 
  const removePhoto = (index) => {
    URL.revokeObjectURL(photos[index].preview);
    
    const newPhotos = photos.filter((_, i) => i !== index);
    const newDescriptions = photoDescriptions.filter((_, i) => i !== index);
    
    setPhotos(newPhotos);
    setPhotoDescriptions(newDescriptions);
  };

  const analyzePhotos = async () => {
    if (photos.length === 0) {
      alert("Please upload at least one photo of your items");
      return;
    }

    setUploading(true);

    try {
      // Here we would normally upload the photos and descriptions to the server
      // For this example, we'll simulate an API call with a timeout
      
      // In a real implementation, you would use FormData to send files
      // const formData = new FormData();
      // photos.forEach((photo, index) => {
      //   formData.append('photos', photo.file);
      //   formData.append('descriptions', photoDescriptions[index]);
      // });
      
      // Add moving details
      // formData.append('from', from);
      // formData.append('to', to);
      // formData.append('date', date);
      // formData.append('distance', distance);

      // const response = await fetch('http://localhost:5000/api/analyze-photos', {
      //   method: 'POST',
      //   body: formData
      // });
      
      // const result = await response.json();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Ini Mock AI
      const mockResult = {
        recommendedLorry: {
          type: "1-Ton Lorry",
          capacity: "Suitable for a 1-2 bedroom apartment",
          estimatedCost: calculateEstimatedCost(distance, "medium"),
          image: "https://example.com/1-ton-lorry.jpg" // You would replace with actual image
        },
        alternatives: [
          {
            type: "3-Ton Lorry",
            capacity: "Suitable for a 3-4 bedroom house",
            estimatedCost: calculateEstimatedCost(distance, "large"),
            image: "https://example.com/3-ton-lorry.jpg"
          },
          {
            type: "Small Van",
            capacity: "Suitable for small items, no furniture",
            estimatedCost: calculateEstimatedCost(distance, "small"),
            image: "https://example.com/small-van.jpg"
          }
        ],
        itemsSummary: "Based on your photos, we detected approximately 15 medium-sized boxes, 1 sofa, 2 chairs, 1 table, and various small items."
      };
      
      setAnalysisResult(mockResult);

    } catch (err) {
      console.error("Error analyzing photos:", err);
      alert("There was an error analyzing your photos. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Calculator
  const calculateEstimatedCost = (distance, size) => {
    const baseRate = size === "small" ? 80 : size === "medium" ? 120 : 200;
    const perKm = size === "small" ? 1.2 : size === "medium" ? 1.8 : 2.5;
    return (baseRate + (perKm * distance)).toFixed(2);
  };

  const continueToBooking = () => {
    navigate('/booking-details', {
      state: {
        from,
        to,
        date,
        distance,
        selectedLorry: analysisResult.recommendedLorry,
        photos: photos.length
      }
    });
  };

  return (
    <div className="bg-blue-50 min-h-screen">
      <div className="h-[70px]">
        <Navbar />
      </div>
      <div className="container mx-auto p-4 pt-24">
        <header className="text-center mb-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-800">Upload Photos for AI Analysis</h2>
          <p className="text-gray-600">Help us recommend the right lorry size for your move</p>
        </header>

        {/* Stepper */}
        <div className="flex items-center justify-center w-full max-w-4xl mx-auto mb-10 mt-4">
          <div className="flex items-center">
            <div className="bg-green-400 text-white rounded-full w-10 h-10 flex items-center justify-center">
              ✓
            </div>
            <div className="flex-auto border-t-2 border-gray-300 mx-4"></div>
            <div className="bg-yellow-400 text-white rounded-full w-10 h-10 flex items-center justify-center">
              📷
            </div>
            <div className="flex-auto border-t-2 border-gray-300 mx-4"></div>
            <div className="bg-white border-2 border-gray-300 text-gray-400 rounded-full w-10 h-10 flex items-center justify-center">
              👥
            </div>
          </div>
        </div>

        {/* Moving Details Summary */}
        {from && to && date && distance && (
          <div className="bg-white p-4 rounded-lg shadow-md max-w-4xl mx-auto mb-8">
            <h3 className="font-semibold text-lg mb-2">Your Moving Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><span className="font-medium">From:</span> {from}</p>
                <p><span className="font-medium">To:</span> {to}</p>
              </div>
              <div>
                <p><span className="font-medium">Date:</span> {date}</p>
                <p><span className="font-medium">Distance:</span> {distance} km</p>
              </div>
            </div>
          </div>
        )}

        {/* Photo Upload Area - Show this when no analysis result yet */}
        {!analysisResult && (
          <div className="max-w-4xl mx-auto">
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center ${isDragging ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="rounded-full bg-yellow-100 p-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Upload Photos of Your Items</h3>
                <p className="text-gray-500 max-w-md">
                  Take photos of the items you're moving so our AI can recommend the right lorry size. Include all major furniture and boxes.
                </p>
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium shadow-sm hover:opacity-90 transition-opacity"
                >
                  Select Photos
                </button>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  ref={fileInputRef}
                />
                <p className="text-sm text-gray-400">or drop your photos here</p>
              </div>
            </div>

            {/* Photo Preview Grid */}
            {photos.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Your Photos ({photos.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg shadow-md">
                      <div className="relative">
                        <img 
                          src={photo.preview} 
                          alt={`Preview ${index + 1}`} 
                          className="w-full h-48 object-cover rounded-md mb-2" 
                        />
                        <button 
                          onClick={() => removePhoto(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-sm font-medium text-gray-800 truncate">{photo.name}</p>
                      <textarea
                        placeholder="Add a description of this item (optional)"
                        value={photoDescriptions[index] || ''}
                        onChange={(e) => updateDescription(index, e.target.value)}
                        className="w-full mt-2 text-sm p-2 border border-gray-200 rounded resize-none focus:ring-blue-500 focus:border-blue-500"
                        rows={2}
                      ></textarea>
                    </div>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <button
                    onClick={analyzePhotos}
                    disabled={uploading}
                    className={`bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-8 py-3 rounded-lg font-semibold shadow-md ${uploading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'} transition-opacity`}
                  >
                    {uploading ? 'Analyzing...' : 'Analyze My Items'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI Analysis Results */}
        {analysisResult && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-green-100 p-2 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Analysis Complete!</h3>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600">{analysisResult.itemsSummary}</p>
              </div>

              <h4 className="font-bold text-lg mb-3">Recommended Lorry</h4>
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200 mb-6">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 mb-4 md:mb-0">
                    <div className="bg-gray-200 rounded-lg h-40 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    </div>
                  </div>
                  <div className="md:w-3/4 md:pl-6">
                    <h5 className="font-bold text-xl">{analysisResult.recommendedLorry.type}</h5>
                    <p className="text-gray-700 mb-2">{analysisResult.recommendedLorry.capacity}</p>
                    <div className="flex items-center">
                      <div className="bg-yellow-400 text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="font-bold text-lg">RM {analysisResult.recommendedLorry.estimatedCost}</p>
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="font-bold text-lg mb-3">Alternative Options</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {analysisResult.alternatives.map((alt, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex">
                      <div className="w-1/4">
                        <div className="bg-gray-100 rounded-lg h-20 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                          </svg>
                        </div>
                      </div>
                      <div className="w-3/4 pl-4">
                        <h5 className="font-semibold">{alt.type}</h5>
                        <p className="text-sm text-gray-600">{alt.capacity}</p>
                        <p className="font-medium mt-1">RM {alt.estimatedCost}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <button
                  onClick={continueToBooking}
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:opacity-90 transition-opacity"
                >
                  Continue with Recommended Lorry
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPhotos;
