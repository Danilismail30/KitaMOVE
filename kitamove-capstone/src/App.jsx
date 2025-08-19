import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import FindLorry from './pages/FindLorry';
import UploadPhotos from './pages/UploadPhotos';
import BookingDetails from './pages/BookingDetails';

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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/find-lorry" element={<FindLorry />} />
          <Route path="/upload-photos" element={<UploadPhotos />} />
          <Route path="/booking-details" element={<BookingDetails />} />
        </Routes>
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
}

export default App;