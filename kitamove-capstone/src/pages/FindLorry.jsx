import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const FindLorry = () => {
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [fromCoords, setFromCoords] = useState(null);
  const [toCoords, setToCoords] = useState(null);
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(null);
  const [date, setDate] = useState("");
  const [calculatingRoute, setCalculatingRoute] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const typingTimeoutRef = useRef(null);
  const lastQueryRef = useRef("");

  const searchLocation = (query, setter) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(async () => {
      if (!query) {
        setter([]);
        return;
      }

      lastQueryRef.current = query; 

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&countrycodes=MY&limit=5&dedupe=1&q=${encodeURIComponent(query)}`
      );
      const data = await res.json();

      // kalau mau update latest query baru update
      if (lastQueryRef.current === query) {
        setter(data);
      }
    }, 300); 
  };

  const selectLocation = (place, type) => {
    const coords = [parseFloat(place.lat), parseFloat(place.lon)];
    if (type === "from") {
      setFrom(place.display_name);
      setFromCoords(coords);
      setFromSuggestions([]);
    } else {
      setTo(place.display_name);
      setToCoords(coords);
      setToSuggestions([]);
    }
  };

  const getRoute = async () => {
    if (!fromCoords || !toCoords) {
      alert("Please select both locations!");
      return;
    }
    
    if (!date) {
      alert("Please select a moving date!");
      return;
    }

    setCalculatingRoute(true);
    setErrorMessage("");

    try {
      console.log("Calculating route with:", {
        from: fromCoords,
        to: toCoords,
        date: date
      });
      
      const res = await fetch(`${API_BASE}/api/route`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: `${fromCoords[0]},${fromCoords[1]}`,
          to: `${toCoords[0]},${toCoords[1]}`,
          date: date
        })
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("API Error:", errorText);
        throw new Error(`Request failed: ${res.status} - ${errorText}`);
      }
      
      const json = await res.json();
      console.log("Route data received:", json);
      
      if (!json.features || !json.features[0] || !json.features[0].geometry) {
        throw new Error("Invalid route data format received");
      }

      const coords = json.features[0].geometry.coordinates.map((c) => [c[1], c[0]]);
      setRoute(coords);

      const km = (json.features[0].properties.segments[0].distance / 1000).toFixed(2);
      setDistance(km);
      
      console.log("Route calculated successfully:", coords.length, "points,", km, "km");
    } catch (err) {
      console.error("Route error:", err);
      setErrorMessage(err?.message || "Could not fetch route. Please try again.");
    } finally {
      setCalculatingRoute(false);
    }
  };
  
  const goToPhotoUpload = () => {
    if (!distance) {
      alert("Please calculate your route first!");
      return;
    }
    
    navigate('/upload-photos', {
      state: {
        from,
        to,
        date,
        distance
      }
    });
  };

  const FitBounds = ({ coords }) => {
    const map = useMap();
    if (coords.length > 0) {
      map.fitBounds(coords);
    }
    return null;
  };

  return (
    <div className="bg-blue-50 min-h-screen">
      <div className="h-[70px]">
        <Navbar />
      </div>
      <div className="mx-auto px-6 pt-24 max-w-[1800px]">
        <header className="text-center mb-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-800">Lorry Rental Service</h2>
          <p className="text-gray-600">Find the best route for your move</p>
        </header>
        
        {/* Stepper */}
        <div className="flex items-center justify-center w-full max-w-4xl mx-auto mb-10 mt-4">
          <div className="flex items-center">
            <div className="bg-yellow-400 text-white rounded-full w-10 h-10 flex items-center justify-center">
              📍
            </div>
            <div className="flex-auto border-t-2 border-gray-300 mx-4"></div>
            <div className="bg-white border-2 border-gray-300 text-gray-400 rounded-full w-10 h-10 flex items-center justify-center">
              📷
            </div>
            <div className="flex-auto border-t-2 border-gray-300 mx-4"></div>
            <div className="bg-white border-2 border-gray-300 text-gray-400 rounded-full w-10 h-10 flex items-center justify-center">
              👥
            </div>
          </div>
        </div>

       
        <div className="flex flex-col lg:flex-row items-stretch gap-8 max-w-[1700px] w-full mx-auto">
          
          <div className="bg-white p-8 rounded-2xl shadow-lg h-[800px] overflow-y-auto flex-1 z-10">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              📍 Moving Locations
            </h3>
            
            <div className="mb-4 relative">
              <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">Moving From</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  📍
                </div>
                <input
                  type="text"
                  id="from"
                  value={from}
                  onChange={(e) => {
                    setFrom(e.target.value);
                    searchLocation(e.target.value, setFromSuggestions);
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter pickup address"
                />
              </div>
              {fromSuggestions.length > 0 && (
                <ul className="mt-1 border border-gray-200 rounded-md bg-white shadow-sm z-30 absolute top-full left-0 right-0">
                  {fromSuggestions.map((place) => (
                    <li
                      key={place.place_id}
                      onClick={() => selectLocation(place, "from")}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    >
                      {place.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mb-4 relative">
              <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">Moving To</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  ➢
                </div>
                <input
                  type="text"
                  id="to"
                  value={to}
                  onChange={(e) => {
                    setTo(e.target.value);
                    searchLocation(e.target.value, setToSuggestions);
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter destination address"
                />
              </div>
              {toSuggestions.length > 0 && (
                <ul className="mt-1 border border-gray-200 rounded-md bg-white shadow-sm z-30 absolute top-full left-0 right-0">
                  {toSuggestions.map((place) => (
                    <li
                      key={place.place_id}
                      onClick={() => selectLocation(place, "to")}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    >
                      {place.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Moving Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  📅
                </div>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            <div className="text-center pt-4">
              <button 
                onClick={getRoute}
                disabled={calculatingRoute}
                className={`w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:opacity-90 transition-opacity ${calculatingRoute ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {calculatingRoute ? 'Calculating...' : 'Calculate Route'}
              </button>
              {!fromCoords || !toCoords || !date ? (
                <p className="text-xs text-gray-500 mt-3">Please fill in all fields to continue</p>
              ) : null}
              {errorMessage && (
                <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                  {errorMessage}
                </div>
              )}
            </div>

            {distance && (
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-bold mb-2">Route Information</h4>
                <p><span className="font-semibold">Distance:</span> {distance} km</p>
                <p className="text-xs text-gray-500 mt-2">From: {from} <br />To: {to} <br />Date: {date}</p>
                
                <div className="mt-6">
                  <button 
                    onClick={goToPhotoUpload}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:opacity-90 transition-opacity"
                  >
                    Continue to Upload Photos
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Map Container */}
          <div
            className="bg-white rounded-2xl shadow-lg h-[800px] flex-1 flex items-center justify-center overflow-hidden"
          >
              <MapContainer
                center={[3.139, 101.6869]}
                zoom={7}
                style={{ height: "100%", width: "100%", borderRadius: '1rem' }}
                className="h-full w-full"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="© OpenStreetMap contributors"
                />
                {route.length > 0 && (
                  <>
                    <Polyline positions={route} color="#f59e42" weight={6} />
                    <FitBounds coords={route} />
                    {fromCoords && (
                      <Marker position={fromCoords}>
                        <Popup>From: {from}</Popup>
                      </Marker>
                    )}
                    {toCoords && (
                      <Marker position={toCoords}>
                        <Popup>To: {to}</Popup>
                      </Marker>
                    )}
                  </>
                )}
              </MapContainer>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FindLorry;
