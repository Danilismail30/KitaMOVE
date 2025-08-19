import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const properties = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    title: "The Elysia Park Residence",
    price: "RM 1,950 /mo",
    details: "1 Bed | 1 Bath | 520 sqft | RM 3.75 psf",
    description: "Jalan Persiaran Medini Utara 1, Medini, Iskandar Puteri (Nusajaya), Johor",
    agent: "Yvonne Wong"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1460518451285-97b6aa326961?auto=format&fit=crop&w=800&q=80",
    title: "Terrace house at Kota Kinabalu",
    price: "RM 3,600 /mo",
    details: "6 Beds | 6 Baths | 2,500 sqft | 4,000 sqft (land)",
    description: "Taman Ganang Riverside, Jalan Sodomon, Kota Kinabalu, Sabah",
    agent: "Zoey Liau"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80",
    title: "Terrace house at Kota Kinabalu",
    price: "RM 2,800 /mo",
    details: "3 Beds | 2 Baths | 1,800 sqft | 2,000 sqft (land)",
    description: "Lorong Seri Borneo 1, Kota Kinabalu, Sabah",
    agent: "Zoey Liau"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80",
    title: "Luxury Condo in KL City",
    price: "RM 4,500 /mo",
    details: "3 Beds | 2 Baths | 1,200 sqft | RM 3.75 psf",
    description: "Jalan Ampang, Kuala Lumpur",
    agent: "Farah Lee"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=800&q=80",
    title: "Bungalow at Penang Hill",
    price: "RM 7,200 /mo",
    details: "5 Beds | 4 Baths | 3,500 sqft | RM 2.05 psf",
    description: "Penang Hill, Penang",
    agent: "Lim Wei"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
    title: "Studio Apartment in PJ",
    price: "RM 1,200 /mo",
    details: "1 Bed | 1 Bath | 400 sqft | RM 3.00 psf",
    description: "Petaling Jaya, Selangor",
    agent: "Aiman Hakim"
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1472224371017-08207f84aaae?auto=format&fit=crop&w=800&q=80",
    title: "Semi-D at Johor Bahru",
    price: "RM 3,900 /mo",
    details: "4 Beds | 3 Baths | 2,000 sqft | RM 1.95 psf",
    description: "Taman Molek, Johor Bahru, Johor",
    agent: "Siti Nur"
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=800&q=80",
    title: "Townhouse in Shah Alam",
    price: "RM 2,500 /mo",
    details: "3 Beds | 2 Baths | 1,100 sqft | RM 2.27 psf",
    description: "Section 13, Shah Alam, Selangor",
    agent: "Raja Azlan"
  }
];

export default function HouseRental() {
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [showBedroomDropdown, setShowBedroomDropdown] = useState(false);
  const [showWelcomeDropdown, setShowWelcomeDropdown] = useState(false);

  return (
    <div className="bg-[#fcf7f2] min-h-screen flex flex-col">
      {/* Filter Bar */}
  <div className="w-full px-8 pt-8 pb-4 mt-20">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-gray-500 text-sm">Home / <span className="underline cursor-pointer text-blue-600">Property for Rent</span></span>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center w-full md:w-auto">
            <div className="relative w-full md:w-[500px]">
              <input className="rounded-full px-5 py-3 border w-full text-lg" placeholder="kota kinabalu" />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">🔍</span>
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">✕</button>
            </div>
          </div>
          <button className="border rounded-full px-6 py-3 font-semibold flex items-center gap-2 text-lg">
            <span>All Residential</span>
          </button>
          <button className="border rounded-full px-6 py-3 font-semibold flex items-center gap-2 text-lg">
            <span>💲</span>
            <span>Price</span>
          </button>
          <button className="border rounded-full px-6 py-3 font-semibold flex items-center gap-2 text-lg">
            <span>🛏️</span>
            <span>Bedroom</span>
          </button>
          <button className="border rounded-full px-6 py-3 font-semibold flex items-center gap-2 text-lg relative">
            <span>🧑‍🤝‍🧑</span>
            <span>Everyone Welcome</span>
            <span className="bg-red-500 text-white rounded-full w-3 h-3 flex items-center justify-center text-xs absolute -top-1 -right-1">•</span>
          </button>
          <button className="border rounded-full px-6 py-3 font-semibold flex items-center gap-2 text-lg ml-auto">
            <span>🔖</span>
            <span>Save Search</span>
          </button>
        </div>
        <hr className="mt-4" />
        <div className="mt-2 text-gray-700 text-base font-medium">206 Properties for Rent - Kota Kinabalu</div>
      </div>
      {/* Main Content */}
      <div className="flex flex-row gap-8 px-8 py-8">
        {/* Property List */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-gray-500 text-sm">{properties.length} Properties for Rent</span>
            <button className="border rounded-full px-4 py-2 text-sm">Recommended</button>
            <label className="flex items-center gap-2 ml-4 cursor-pointer">
              <span className="text-sm">Map View</span>
              <input type="checkbox" checked={showMap} onChange={() => setShowMap(!showMap)} />
            </label>
          </div>
          {!showMap ? (
            <div className="flex flex-col gap-6">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="bg-white rounded-2xl shadow p-6 flex gap-6 cursor-pointer hover:shadow-lg transition"
                  onClick={() => navigate(`/property/${property.id}`)}
                >
                  <img src={property.image} alt={property.title} className="w-48 h-36 object-cover rounded-xl" />
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="font-bold text-lg mb-1">{property.title}</h3>
                      <p className="text-orange-500 font-bold text-xl mb-1">{property.price}</p>
                      <p className="text-gray-600 text-sm mb-2">{property.details}</p>
                      <p className="text-gray-500 text-sm mb-2">{property.description}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-500">Listed by <span className="font-semibold">{property.agent}</span></span>
                      <button className="border rounded-full px-4 py-2 text-sm">Contact Agent</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow p-6 flex items-center justify-center min-h-[400px]">Map View Placeholder</div>
          )}
        </div>
        {/* Sidebar */}
        <div className="w-96 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h4 className="font-bold mb-2">Explore PropertyGuru</h4>
            <p className="text-sm text-gray-500 mb-2">There are {properties.length} Properties for Rent. You can use our elegant property search tool to find the right Terrace, Link House, Condominium, Apartment, Semi-Detached House, Bungalow House and more.</p>
            <div className="flex flex-wrap gap-2">
              <button className="border rounded-full px-3 py-1 text-xs">Selangor</button>
              <button className="border rounded-full px-3 py-1 text-xs">Kuala Lumpur</button>
              <button className="border rounded-full px-3 py-1 text-xs">Show More</button>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
            <h4 className="font-bold mb-2 text-red-500">SCAM ALERT</h4>
            <ul className="text-sm text-gray-500 mb-2 list-disc pl-4">
              <li>Pay only verified property agencies, not agents.</li>
              <li>Avoiding cash transactions.</li>
              <li>Verifying agencies at <a href="https://search.lppeh.gov.my/" className="text-blue-500 underline">search.lppeh.gov.my</a></li>
            </ul>
            <p className="text-xs text-gray-400">Stay vigilant to ensure a secure transaction.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
