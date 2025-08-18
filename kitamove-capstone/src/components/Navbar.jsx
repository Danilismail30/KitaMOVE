import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import fullLogo from '../assets/Logo.svg'; 

const Navbar = () => {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = () => {
    if (typeof window !== 'undefined') { 
      if (window.scrollY > lastScrollY) { // kalau scroll bawah
        setVisible(false); 
      } else { // kalau scroll atas
        setVisible(true);  
      }
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);

      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);

  return (
    // 1. ganti posisi 'top' dengan 'transform' untuk tapuk habis.
    // 2. Ganti transition-all dengan transition-transform.
    <header 
      className={`bg-gradient-to-r from-blue-100 via-indigo-50 to-purple-100 shadow-md text-gray-800 fixed w-full z-50 transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <nav className="container mx-auto px-6 py-1 flex justify-between items-center">
        
        <div>
          <Link to="/" className="cursor-pointer">
            <img src={fullLogo} alt="KitaMOVE Logo" className="w-24 h-auto" />
          </Link>
        </div>

        <ul className="flex items-center space-x-6">
           <li><Link to="/" className="text-gray-700 hover:text-orange-500 font-medium">Home</Link></li>
          <li><a href="#" className="text-gray-700 hover:text-orange-500 font-medium">Lorry</a></li>
          <li><a href="#" className="text-gray-700 hover:text-orange-500 font-medium">House Rental</a></li>
          <li><a href="#" className="text-gray-700 hover:text-orange-500 font-medium">About Us</a></li>
        </ul>
        <a href="#" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-1.5 px-4 rounded-full transition duration-300 text-sm">
          Sign In
        </a>
      </nav>
    </header>
  );
};

export default Navbar;