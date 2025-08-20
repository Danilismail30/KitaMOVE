import { Routes, Route, useLocation } from 'react-router-dom';
import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const Home = React.lazy(() => import('./pages/Home'));
const FindLorry = React.lazy(() => import('./pages/FindLorry'));
const UploadPhotos = React.lazy(() => import('./pages/UploadPhotos'));
const BookingDetails = React.lazy(() => import('./pages/BookingDetails'));
const HouseRental = React.lazy(() => import('./pages/HouseRental'));
const PropertyDetails = React.lazy(() => import('./pages/PropertyDetails'));
const NotFound = () => (
  <div className="min-h-[60vh] flex items-center justify-center text-gray-600">Page not found</div>
);

function App() {
  const location = useLocation();
  // Only show Footer on homepage
  const showFooter = location.pathname === '/';
  // Don't show the App's Navbar on pages that have their own navbar
  const showNavbar = !['/find-lorry', '/upload-photos', '/booking-details'].includes(location.pathname);

  return (
    <div className="bg-gray-50 min-h-screen">
      {showNavbar && <Navbar />}
      
      <main>
        <React.Suspense fallback={<div className="p-8 text-center text-gray-500">Loading...</div>}>
          <Routes>
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/" element={<Home />} />
            <Route path="/find-lorry" element={<FindLorry />} />
            <Route path="/upload-photos" element={<UploadPhotos />} />
            <Route path="/booking-details" element={<BookingDetails />} />
            <Route path="/houserental" element={<HouseRental />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </React.Suspense>
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
}

export default App;