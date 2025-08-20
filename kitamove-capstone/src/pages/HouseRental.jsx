import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";

// Basic Leaflet marker icon fix for bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Demo data enriched with structured fields for filtering + map coords
const properties = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    title: "The Elysia Park Residence",
    price: "RM 1,950 /mo",
    details: "1 Bed | 1 Bath | 520 sqft | RM 3.75 psf",
    description: "Jalan Persiaran Medini Utara 1, Medini, Iskandar Puteri (Nusajaya), Johor",
    agent: "Yvonne Wong",
    beds: 1,
    baths: 1,
    sqft: 520,
    type: "Condo",
    coords: [1.4267, 103.6298],
    featured: true
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1460518451285-97b6aa326961?auto=format&fit=crop&w=800&q=80",
    title: "Terrace house at Kota Kinabalu",
    price: "RM 3,600 /mo",
    details: "6 Beds | 6 Baths | 2,500 sqft | 4,000 sqft (land)",
    description: "Taman Ganang Riverside, Jalan Sodomon, Kota Kinabalu, Sabah",
    agent: "Zoey Liau",
    beds: 6,
    baths: 6,
    sqft: 2500,
    type: "Terrace",
    coords: [5.9804, 116.0735],
    featured: false
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80",
    title: "Terrace house at Kota Kinabalu",
    price: "RM 2,800 /mo",
    details: "3 Beds | 2 Baths | 1,800 sqft | 2,000 sqft (land)",
    description: "Lorong Seri Borneo 1, Kota Kinabalu, Sabah",
    agent: "Zoey Liau",
    beds: 3,
    baths: 2,
    sqft: 1800,
    type: "Terrace",
    coords: [5.95, 116.05],
    featured: false
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80",
    title: "Luxury Condo in KL City",
    price: "RM 4,500 /mo",
    details: "3 Beds | 2 Baths | 1,200 sqft | RM 3.75 psf",
    description: "Jalan Ampang, Kuala Lumpur",
    agent: "Farah Lee",
    beds: 3,
    baths: 2,
    sqft: 1200,
    type: "Condo",
    coords: [3.139, 101.6869],
    featured: true
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=800&q=80",
    title: "Bungalow at Penang Hill",
    price: "RM 7,200 /mo",
    details: "5 Beds | 4 Baths | 3,500 sqft | RM 2.05 psf",
    description: "Penang Hill, Penang",
    agent: "Lim Wei",
    beds: 5,
    baths: 4,
    sqft: 3500,
    type: "Bungalow",
    coords: [5.4141, 100.3288],
    featured: false
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
    title: "Studio Apartment in PJ",
    price: "RM 1,200 /mo",
    details: "1 Bed | 1 Bath | 400 sqft | RM 3.00 psf",
    description: "Petaling Jaya, Selangor",
    agent: "Aiman Hakim",
    beds: 1,
    baths: 1,
    sqft: 400,
    type: "Studio",
    coords: [3.1073, 101.6067],
    featured: false
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1472224371017-08207f84aaae?auto=format&fit=crop&w=800&q=80",
    title: "Semi-D at Johor Bahru",
    price: "RM 3,900 /mo",
    details: "4 Beds | 3 Baths | 2,000 sqft | RM 1.95 psf",
    description: "Taman Molek, Johor Bahru, Johor",
    agent: "Siti Nur",
    beds: 4,
    baths: 3,
    sqft: 2000,
    type: "Semi-D",
    coords: [1.4927, 103.7414],
    featured: false
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=800&q=80",
    title: "Townhouse in Shah Alam",
    price: "RM 2,500 /mo",
    details: "3 Beds | 2 Baths | 1,100 sqft | RM 2.27 psf",
    description: "Section 13, Shah Alam, Selangor",
    agent: "Raja Azlan",
    beds: 3,
    baths: 2,
    sqft: 1100,
    type: "Townhouse",
    coords: [3.0738, 101.5183],
    featured: false
  }
];

export default function HouseRental() {
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [priceRange, setPriceRange] = useState("any"); // any | lt2k | 2to4 | gt4
  const [minBeds, setMinBeds] = useState(0); // 0=any
  const [typeFilter, setTypeFilter] = useState("any");
  const [sortBy, setSortBy] = useState("recommended"); // recommended | price_low | price_high | newest
  const [saved, setSaved] = useState(() => {
    try {
      const raw = localStorage.getItem('km_saved_properties');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const toggleSaved = (id) => {
    setSaved(prev => {
      const next = { ...prev, [id]: !prev[id] };
      try { localStorage.setItem('km_saved_properties', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const parsePrice = (p) => {
    const m = p.replace(/[^0-9]/g, "");
    return Number(m) || 0;
  };

  const filtered = useMemo(() => {
    const filteredList = properties.filter(p => {
      const price = parsePrice(p.price);
      const matchesQuery = [p.title, p.description, p.type, p.agent]
        .join(" ").toLowerCase().includes(query.toLowerCase());
      const matchesPrice = (
        priceRange === 'any' ||
        (priceRange === 'lt2k' && price < 200000) ||
        (priceRange === '2to4' && price >= 200000 && price <= 400000) ||
        (priceRange === 'gt4' && price > 400000)
      );
      const matchesBeds = p.beds >= (minBeds || 0);
      const matchesType = typeFilter === 'any' || (p.type || '').toLowerCase() === typeFilter;
      return matchesQuery && matchesPrice && matchesBeds && matchesType;
    });

    const sorted = [...filteredList];
    if (sortBy === 'price_low') sorted.sort((a,b)=>parsePrice(a.price)-parsePrice(b.price));
    if (sortBy === 'price_high') sorted.sort((a,b)=>parsePrice(b.price)-parsePrice(a.price));
    if (sortBy === 'newest') sorted.reverse();
    return sorted;
  }, [query, priceRange, minBeds, typeFilter, sortBy]);

  const center = filtered[0]?.coords || [3.139, 101.6869];

  // Reusable stylable dropdown (custom) for better control over the menu container
  const FilterSelect = ({ value, onChange, options, label }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
      const onDocClick = (e) => {
        if (ref.current && !ref.current.contains(e.target)) setOpen(false);
      };
      const onEsc = (e) => { if (e.key === 'Escape') setOpen(false); };
      document.addEventListener('mousedown', onDocClick);
      document.addEventListener('keydown', onEsc);
      return () => {
        document.removeEventListener('mousedown', onDocClick);
        document.removeEventListener('keydown', onEsc);
      };
    }, []);

    const current = options.find(o => o.value === value);

    return (
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="border rounded-full px-6 py-3 font-semibold text-lg bg-white hover:bg-gray-50 flex items-center gap-2 shadow-sm"
        >
          <span>{current?.label || label}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.086l3.71-3.856a.75.75 0 111.08 1.04l-4.24 4.41a.75.75 0 01-1.08 0l-4.24-4.41a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
        </button>
        {open && (
          <div className="absolute z-[10000] mt-2 w-64 rounded-xl border border-gray-100 bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden">
            <ul className="max-h-80 overflow-y-auto py-1">
              {options.map((opt) => (
                <li key={String(opt.value)}>
                  <button
                    type="button"
                    onClick={() => { onChange(opt.value); setOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-base hover:bg-orange-50 hover:text-orange-600 ${opt.value === value ? 'bg-orange-100 text-orange-700 font-semibold' : 'text-gray-800'}`}
                  >
                    {opt.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

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
              <input value={query} onChange={(e)=>setQuery(e.target.value)} className="rounded-full px-12 py-3 border w-full text-lg" placeholder="Search location, project or keyword" />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">🔍</span>
              {query && (
                <button onClick={()=>setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">✕</button>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <FilterSelect
              value={typeFilter}
              onChange={setTypeFilter}
              label="All Residential"
              options={[
                { label: 'All Residential', value: 'any' },
                { label: 'Condo', value: 'condo' },
                { label: 'Terrace', value: 'terrace' },
                { label: 'Semi-D', value: 'semi-d' },
                { label: 'Bungalow', value: 'bungalow' },
                { label: 'Townhouse', value: 'townhouse' },
                { label: 'Studio', value: 'studio' },
              ]}
            />

            <FilterSelect
              value={priceRange}
              onChange={setPriceRange}
              label="Any Price"
              options={[
                { label: 'Any Price', value: 'any' },
                { label: 'Below RM 2,000', value: 'lt2k' },
                { label: 'RM 2,000 - RM 4,000', value: '2to4' },
                { label: 'Above RM 4,000', value: 'gt4' },
              ]}
            />

            <FilterSelect
              value={minBeds}
              onChange={setMinBeds}
              label="Any Bedrooms"
              options={[
                { label: 'Any Bedrooms', value: 0 },
                { label: '1+ Bedroom', value: 1 },
                { label: '2+ Bedrooms', value: 2 },
                { label: '3+ Bedrooms', value: 3 },
                { label: '4+ Bedrooms', value: 4 },
                { label: '5+ Bedrooms', value: 5 },
              ]}
            />
            <button onClick={()=>{setQuery("");setPriceRange('any');setMinBeds(0);setTypeFilter('any');}} className="border rounded-full px-6 py-3 font-semibold text-lg">
              Clear
            </button>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={()=>alert('Search saved. (Demo)')}
              className="hidden md:inline-flex items-center gap-2 border rounded-full px-5 py-2.5 font-semibold text-sm bg-white hover:bg-gray-50 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v18l-7-4-7 4V5z"/></svg>
              Save Search
            </button>
            <label className="flex items-center gap-2 cursor-pointer">
              <span>Map View</span>
              <input type="checkbox" checked={showMap} onChange={()=>setShowMap(!showMap)} />
            </label>
            <div>
              <FilterSelect
                value={sortBy}
                onChange={setSortBy}
                label="Recommended"
                options={[
                  { label: 'Recommended', value: 'recommended' },
                  { label: 'Price: Low to High', value: 'price_low' },
                  { label: 'Price: High to Low', value: 'price_high' },
                  { label: 'Newest', value: 'newest' },
                ]}
              />
            </div>
          </div>
        </div>
        <hr className="mt-4" />
        <div className="mt-2 text-gray-700 text-base font-medium">{filtered.length} Properties for Rent</div>
      </div>
      {/* Main Content */}
      <div className="flex flex-row gap-8 px-8 py-8">
        {/* Property List */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-gray-500 text-sm">{filtered.length} Properties for Rent</span>
            <button className="border rounded-full px-4 py-2 text-sm">Recommended</button>
          </div>
          {!showMap ? (
            <div className="flex flex-col gap-6">
              {filtered.map((property) => (
                <div
                  key={property.id}
                  className="bg-white rounded-2xl shadow p-6 flex gap-6 cursor-pointer hover:shadow-lg transition"
                  onClick={() => navigate(`/property/${property.id}`)}
                >
                  <div className="relative">
                    <img src={property.image} alt={property.title} className="w-48 h-36 object-cover rounded-xl" />
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSaved(property.id); }}
                      aria-label={saved[property.id] ? 'Unsave property' : 'Save property'}
                      className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition"
                    >
                      {saved[property.id] ? (
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
            <div className="bg-white rounded-2xl shadow overflow-hidden">
              <MapContainer
                center={center}
                zoom={11}
                style={{ height: "700px", width: "100%" }}
                className="rounded-2xl"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="© OpenStreetMap contributors"
                />
                {filtered.map((p) => (
                  <Marker key={p.id} position={p.coords}>
                    <Popup>
                      <div className="font-semibold mb-1">{p.title}</div>
                      <div className="text-orange-500 font-bold mb-1">{p.price}</div>
                      <button onClick={()=>navigate(`/property/${p.id}`)} className="text-blue-600 underline">View</button>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          )}
        </div>
        {/* Sidebar */}
        <div className="w-96 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h4 className="font-bold mb-2">Explore PropertyGuru</h4>
            <p className="text-sm text-gray-500 mb-2">There are {filtered.length} Properties for Rent. You can use our elegant property search tool to find the right Terrace, Link House, Condominium, Apartment, Semi-Detached House, Bungalow House and more.</p>
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
