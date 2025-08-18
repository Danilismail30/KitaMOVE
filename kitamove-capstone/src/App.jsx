import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home'; // We'll create this next (on development)
import FindLorry from './pages/FindLorry';

function App() {
  const location = useLocation();
  // Ini untuk mau kasi tunjuk bila Navbar dan Footer muncul
  const showNavbarFooter = location.pathname === '/';

  return (
    <div className="bg-gray-50 min-h-screen">
      {showNavbarFooter && <Navbar />}
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/find-lorry" element={<FindLorry />} />
        </Routes>
      </main>
      
      {showNavbarFooter && <Footer />}
    </div>
  );
}

export default App;