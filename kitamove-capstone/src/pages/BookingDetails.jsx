import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from '../components/Navbar';

const BookingDetails = () => {
  const location = useLocation();
  const { from, to, date, distance, selectedLorry, photos } = location.state || {};
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingId, setBookingId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !phone || !email) {
      alert("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a random booking ID
      const generatedId = "KM" + Math.floor(100000 + Math.random() * 900000);
      setBookingId(generatedId);
      setBookingComplete(true);
    } catch (err) {
      console.error("Error submitting booking:", err);
      alert("There was an error submitting your booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-blue-50 min-h-screen">
      <div className="h-[70px]">
        <Navbar />
      </div>
      <div className="container mx-auto p-4 pt-24">
        <header className="text-center mb-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-800">Complete Your Booking</h2>
          <p className="text-gray-600">Just a few more details to finalize your lorry booking</p>
        </header>

        {/* Stepper */}
        <div className="flex items-center justify-center w-full max-w-4xl mx-auto mb-10 mt-4">
          <div className="flex items-center">
            <div className="bg-green-400 text-white rounded-full w-10 h-10 flex items-center justify-center">
              ✓
            </div>
            <div className="flex-auto border-t-2 border-gray-300 mx-4"></div>
            <div className="bg-green-400 text-white rounded-full w-10 h-10 flex items-center justify-center">
              ✓
            </div>
            <div className="flex-auto border-t-2 border-gray-300 mx-4"></div>
            <div className="bg-yellow-400 text-white rounded-full w-10 h-10 flex items-center justify-center">
              👥
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {!bookingComplete ? (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Your Moving Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="mb-2"><span className="font-medium">From:</span> {from}</p>
                    <p className="mb-2"><span className="font-medium">To:</span> {to}</p>
                    <p><span className="font-medium">Date:</span> {date}</p>
                  </div>
                  <div>
                    <p className="mb-2"><span className="font-medium">Distance:</span> {distance} km</p>
                    <p className="mb-2"><span className="font-medium">Selected Lorry:</span> {selectedLorry?.type}</p>
                    <p className="mb-2"><span className="font-medium">Estimated Cost:</span> RM {selectedLorry?.estimatedCost}</p>
                    <p><span className="font-medium">Photos Uploaded:</span> {photos}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                
                <div className="mb-8">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Additional Notes (Optional)</label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any special instructions or requirements for your move"
                  ></textarea>
                </div>
                
                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-10 py-3 rounded-lg font-semibold shadow-md ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'} transition-opacity`}
                  >
                    {isSubmitting ? 'Processing...' : 'Complete Booking'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="mb-6">
                <div className="bg-green-100 rounded-full mx-auto w-24 h-24 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Booking Complete!</h3>
              <p className="text-gray-600 mb-6">Thank you for booking with KitaMOVE. Your booking has been confirmed.</p>
              <div className="bg-blue-50 p-4 rounded-lg inline-block">
                <p className="text-lg font-semibold">Your Booking Reference</p>
                <p className="text-2xl font-bold text-blue-600">{bookingId}</p>
              </div>
              <div className="mt-8 text-gray-600">
                <p>An email confirmation has been sent to {email}.</p>
                <p className="mt-2">Our team will contact you shortly to confirm all details.</p>
              </div>
              <div className="mt-8">
                <a 
                  href="/" 
                  className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:opacity-90 transition-opacity"
                >
                  Return to Home
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
