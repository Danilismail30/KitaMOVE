import React from 'react';
import { Link } from 'react-router-dom';

const HandpickedListings = () => {
  // Sample property data - you would typically fetch this from an API
  const properties = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80",
      title: "Hicom Glenmarie",
      location: "U1 Persiaran Kerjaya, Glenmarie, Shah Alam",
      price: "RM 14,000,000",
      period: "",
      type: "Studio",
      tag: "Factory",
      favorite: true,
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1527030280862-64139fba04ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80",
      title: "Solaris Dutamas (Commercial)",
      location: "Jalan Dutamas 1, Kuala Lumpur",
      price: "RM 29,900",
      period: "/mo",
      type: "Studio",
      tag: "Office",
      favorite: false,
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80",
      title: "Only 430k !! [Extra Cash Back + Free Legal Fee]",
      location: "Kampung Kerinchi (Bangsar South), Kuala Lumpur",
      price: "RM 428,788",
      period: "",
      bedrooms: 3,
      bathrooms: 2,
      type: "Condominium",
      tag: "Condominium",
      favorite: true,
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1555636222-cae831e670b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80",
      title: "Semi Detached Factory in IKSPB",
      location: "Taman Juru Indah, Juru, Penang",
      price: "RM 8,000",
      period: "/mo",
      type: "Studio",
      tag: "Factory",
      favorite: false,
    },
  ];

  // State for handling favorites (would be moved to a context or redux in a real app)
  const [favorites, setFavorites] = React.useState(
    properties.reduce((acc, property) => {
      acc[property.id] = property.favorite;
      return acc;
    }, {})
  );

  const toggleFavorite = (id) => {
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Handpicked For You</h2>
          <Link to="/listings" className="text-brand-orange hover:text-brand-orange-dark text-sm font-medium flex items-center">
            View All Properties
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              {/* Property Image */}
              <div className="relative h-48 overflow-hidden group">
                <img 
                  src={property.image} 
                  alt={property.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(property.id);
                    }}
                    className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  >
                    {favorites[property.id] ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Property Details */}
              <div className="p-5">
                <Link to={`/property/${property.id}`} className="group">
                  <h3 className="font-semibold text-lg text-gray-800 line-clamp-1 group-hover:text-brand-orange transition-colors">{property.title}</h3>
                </Link>
                <div className="flex items-start mt-1 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mt-0.5 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-sm text-gray-600 line-clamp-2">{property.location}</p>
                </div>
                
                <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
                  <div className="text-brand-orange font-bold">
                    {property.price}
                    <span className="text-gray-600 font-normal text-sm">{property.period}</span>
                  </div>
                  
                  {/* Bed & Bath Count if available */}
                  {(property.bedrooms || property.bathrooms) && (
                    <div className="flex space-x-4 text-sm text-gray-600">
                      {property.bedrooms && (
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          <span>{property.bedrooms}</span>
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{property.bathrooms}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Property Type Badges */}
                <div className="flex flex-wrap gap-2">
                  {property.type && (
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-md">{property.type}</span>
                  )}
                  {property.tag && property.tag !== property.type && (
                    <span className="px-2 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-md">{property.tag}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/listings" className="inline-flex items-center justify-center bg-white border-2 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white transition-all duration-300 font-medium py-2.5 px-8 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            View More Properties
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HandpickedListings;
