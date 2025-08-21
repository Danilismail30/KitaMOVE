import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import propertiesData from "../data/properties";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = (propertiesData.find((p) => p.id === Number(id)) || propertiesData[0]);
  const recommended = useMemo(() => {
    return propertiesData.filter(p => p.id !== property.id).slice(0, 6);
  }, [property.id]);
  const galleryImages = useMemo(() => {
    const baseImages = Array.isArray(property.images) ? property.images : [];
    const filler = [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d95?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=1200&auto=format&fit=crop",
    ];
    const merged = [...baseImages, ...filler];
    return merged.slice(0, 10);
  }, [property.images]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  // Rental calculator state
  const parsedMonthly = useMemo(() => Number((property.price || '').replace(/[^0-9]/g, '')) || 0, [property.price]);
  const [monthlyRent, setMonthlyRent] = useState(parsedMonthly);
  const [tenancyMonths, setTenancyMonths] = useState(12);
  const [securityDepositMonths, setSecurityDepositMonths] = useState(2);
  const [utilitiesDepositMonths, setUtilitiesDepositMonths] = useState(0.5);
  const [advanceRentalMonths, setAdvanceRentalMonths] = useState(1);
  const [includeStampDuty, setIncludeStampDuty] = useState(true);
  const [includeAgentFee, setIncludeAgentFee] = useState(false);
  const [agentPayerTenant, setAgentPayerTenant] = useState(true); // tenant pays? default off in UI description
  const [showMore, setShowMore] = useState(false);
  const [coords, setCoords] = useState(null); // [lat, lng]
  const [pois, setPois] = useState([]);
  const [loadingPois, setLoadingPois] = useState(false);
  const [activeCats, setActiveCats] = useState({ food: true, education: true, health: true, shopping: true, transport: true });

  // Leaflet icon fix for bundlers
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });

  const pricePsf = (() => {
    const match = /([0-9,]+) sqft/i.exec(property.area || "");
    if (!match) return null;
    const sqft = Number(match[1].replace(/,/g, ""));
    const priceNum = Number((property.price || "").replace(/[^0-9]/g, ""));
    if (!sqft || !priceNum) return null;
    return `RM ${(priceNum / sqft).toFixed(2)} psf`;
  })();

  // Calculator helpers
  const calc = useMemo(() => {
    const rent = Number(monthlyRent) || 0;
    const annual = rent * 12;
    const secDep = rent * Number(securityDepositMonths || 0);
    const utilDep = rent * Number(utilitiesDepositMonths || 0);
    const advRent = rent * Number(advanceRentalMonths || 0);
    let stamp = 0;
    if (includeStampDuty) {
      const bracket = tenancyMonths <= 12 ? 1 : tenancyMonths <= 36 ? 2 : 3; // RM per RM250 annual rent
      stamp = Math.ceil(annual / 250) * bracket;
    }
    let agent = 0;
    if (includeAgentFee && agentPayerTenant) {
      agent = tenancyMonths < 12 ? 0.5 * rent : 1 * rent; // common market practice
    }
    const upfront = secDep + utilDep + advRent + stamp + agent;
    return { secDep, utilDep, advRent, stamp, agent, upfront };
  }, [monthlyRent, tenancyMonths, securityDepositMonths, utilitiesDepositMonths, advanceRentalMonths, includeStampDuty, includeAgentFee, agentPayerTenant]);
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') setLightboxIndex((i) => (i + 1) % galleryImages.length);
      if (e.key === 'ArrowLeft') setLightboxIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [lightboxOpen, galleryImages.length]);

  function extractBeds(details) {
    const m = (details || '').match(/(\d+)\s*Bed/i); return m ? Number(m[1]) : undefined;
  }
  function extractBaths(details) {
    const m = (details || '').match(/(\d+)\s*Bath/i); return m ? Number(m[1]) : undefined;
  }

  // Resolve coordinates: use optional coords on property if available; else geocode by address
  useEffect(() => {
    let mounted = true;
    async function resolveCoords() {
      if (property.coords && property.coords.length === 2) {
        if (mounted) setCoords([property.coords[0], property.coords[1]]);
        return;
      }
      try {
        const q = encodeURIComponent(property.address || property.title);
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${q}`);
        const data = await res.json();
        if (Array.isArray(data) && data[0]) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          if (mounted) setCoords([lat, lon]);
        }
      } catch (e) {
        // silent
      }
    }
    resolveCoords();
    return () => { mounted = false; };
  }, [property.address, property.title]);

  // Fetch POIs from Overpass once coords ready
  useEffect(() => {
    if (!coords) return;
    const [lat, lon] = coords;
    const radius = 1500; // meters
    const amenityRegex = 'restaurant|cafe|fast_food|school|university|college|kindergarten|hospital|clinic|doctors|pharmacy|bus_station|train_station|subway_entrance|ferry_terminal|supermarket|convenience|marketplace|bank|atm';
    const query = `[out:json][timeout:25];(node["amenity"~"${amenityRegex}"](around:${radius},${lat},${lon}););out body;`;
    setLoadingPois(true);
    fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`)
      .then(r => r.json())
      .then(json => {
        const items = (json.elements || []).map(el => {
          const amenity = el.tags?.amenity || '';
          const title = el.tags?.name || amenity;
          const cat = classifyAmenity(amenity);
          return { id: el.id, lat: el.lat, lon: el.lon, amenity, title, cat };
        });
        setPois(items);
      })
      .catch(() => {})
      .finally(() => setLoadingPois(false));
  }, [coords]);

  function classifyAmenity(a) {
    if (/school|college|university|kindergarten/i.test(a)) return 'education';
    if (/hospital|clinic|doctors|pharmacy/i.test(a)) return 'health';
    if (/restaurant|cafe|fast_food/i.test(a)) return 'food';
    if (/supermarket|convenience|marketplace|bank|atm/i.test(a)) return 'shopping';
    if (/bus_station|train_station|subway_entrance|ferry_terminal/i.test(a)) return 'transport';
    return 'other';
  }

  const visiblePois = useMemo(() => pois.filter(p => activeCats[p.cat]), [pois, activeCats]);

  return (
    <div className="bg-[#fcf7f2] min-h-screen px-6 md:px-8 py-8 pt-28 md:pt-32">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumbs */}
        <div className="text-xs md:text-sm text-gray-500 mb-4">
          Home / {property.type} / {property.address?.split(',')[1]?.trim() || 'Malaysia'} / <span className="underline">{property.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Main content */}
          <div className="lg:col-span-2">
            {/* Media gallery */}
            <div className="grid grid-cols-4 grid-rows-2 gap-2 mb-5">
              {galleryImages.slice(0, 5).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => { setLightboxIndex(idx); setLightboxOpen(true); }}
                  className={`${idx === 0 ? 'col-span-2 row-span-2' : ''} relative group`}
                >
                  <img src={img} alt={`${property.title} ${idx+1}`} className="w-full h-40 md:h-64 lg:h-full object-cover rounded-xl" />
                  <span className="hidden md:block absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/10 transition" />
                  {idx === 4 && (
                    <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-sm shadow">Show all media</span>
                  )}
                </button>
              ))}
            </div>

            {/* Lightbox */}
            {lightboxOpen && (
              <div className="fixed inset-0 bg-black/80 z-[10000] flex items-center justify-center">
                <button
                  className="absolute top-5 right-5 text-white text-2xl"
                  onClick={() => setLightboxOpen(false)}
                >
                  ✕
                </button>
                <button
                  className="absolute left-3 md:left-10 text-white text-3xl"
                  onClick={() => setLightboxIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length)}
                >
                  ‹
                </button>
                <img src={galleryImages[lightboxIndex]} alt="preview" className="max-h-[85vh] max-w-[90vw] rounded-xl shadow-2xl" />
                <button
                  className="absolute right-3 md:right-10 text-white text-3xl"
                  onClick={() => setLightboxIndex((i) => (i + 1) % galleryImages.length)}
                >
                  ›
                </button>
              </div>
            )}

            {/* Title, address, price */}
            <div className="mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">{property.title}</h1>
        <p className="text-gray-600 mb-2">{property.address}</p>
              <div className="flex items-center gap-3">
                <span className="text-orange-500 font-extrabold text-2xl">{property.price}</span>
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-4 md:gap-6 mb-6">
              <div className="flex items-center gap-2"><span>🛏️</span><span className="font-medium">{property.beds} Beds</span></div>
              <div className="flex items-center gap-2"><span>🛁</span><span className="font-medium">{property.baths} Baths</span></div>
              <div className="flex items-center gap-2"><span>📐</span><span className="font-medium">{property.area}</span></div>
              <div className="flex items-center gap-2"><span>🏷️</span><span className="font-medium">{property.type}</span></div>
              <div className="flex items-center gap-2"><span>🛋️</span><span className="font-medium">{property.furnished}</span></div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mb-6">
              <button className="inline-flex items-center gap-2 border rounded-full px-4 py-2 bg-white hover:bg-gray-50 shadow-sm">❤ Shortlist</button>
              <button className="inline-flex items-center gap-2 border rounded-full px-4 py-2 bg-white hover:bg-gray-50 shadow-sm">↗ Share</button>
            </div>

            {/* Details sections */}
            <div className="bg-white rounded-2xl shadow p-5 mb-6">
              <h3 className="text-lg font-bold mb-3">Property details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div className="flex items-center gap-2">🏢 <span>{property.type} for rent</span></div>
                <div className="flex items-center gap-2">🛋️ <span>{property.furnished}</span></div>
                <div className="flex items-center gap-2">🆔 <span>Listing ID – 40894879</span></div>
                <div className="flex items-center gap-2">📐 <span>{property.area}{pricePsf ? ` · ${pricePsf}` : ''}</span></div>
                <div className="flex items-center gap-2">📍 <span>{property.address}</span></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-5">
              <h3 className="text-lg font-bold mb-3">About this property</h3>
              <p className="text-gray-700">
                {showMore ? property.description : (property.description || '').slice(0, 220)}
                {property.description && property.description.length > 220 && !showMore ? '…' : ''}
              </p>
              {property.description && property.description.length > 220 && (
                <button className="mt-3 text-blue-600 underline" onClick={() => setShowMore(!showMore)}>
                  {showMore ? 'Show less' : 'See more'}
                </button>
              )}
            </div>

            {/* Rental Calculator (Malaysia) */}
            <div className="bg-white rounded-2xl shadow p-5 mt-6">
              <h3 className="text-lg font-bold mb-4">Rental calculator</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="block text-gray-600 mb-1">Monthly rent (RM)</label>
                  <input type="number" value={monthlyRent} onChange={(e)=>setMonthlyRent(Number(e.target.value))} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Tenancy length (months)</label>
                  <input type="number" value={tenancyMonths} min={1} max={60} onChange={(e)=>setTenancyMonths(Number(e.target.value))} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Security deposit (months)</label>
                  <input type="number" step="0.5" value={securityDepositMonths} onChange={(e)=>setSecurityDepositMonths(Number(e.target.value))} className="w-full border rounded-lg px-3 py-2" />
                  <p className="text-xs text-gray-500 mt-1">Commonly 2 months</p>
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Utilities deposit (months)</label>
                  <input type="number" step="0.5" value={utilitiesDepositMonths} onChange={(e)=>setUtilitiesDepositMonths(Number(e.target.value))} className="w-full border rounded-lg px-3 py-2" />
                  <p className="text-xs text-gray-500 mt-1">Commonly 0.5 month</p>
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Advance rental (months)</label>
                  <input type="number" step="0.5" value={advanceRentalMonths} onChange={(e)=>setAdvanceRentalMonths(Number(e.target.value))} className="w-full border rounded-lg px-3 py-2" />
                  <p className="text-xs text-gray-500 mt-1">Commonly 1 month</p>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={includeStampDuty} onChange={(e)=>setIncludeStampDuty(e.target.checked)} />
                    Include stamp duty (per Stamps Act)
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={includeAgentFee} onChange={(e)=>setIncludeAgentFee(e.target.checked)} />
                    Include agent fee
                  </label>
                  {includeAgentFee && (
                    <label className="inline-flex items-center gap-2 text-xs text-gray-600">
                      <input type="checkbox" checked={agentPayerTenant} onChange={(e)=>setAgentPayerTenant(e.target.checked)} />
                      Tenant pays agent (toggle off if landlord pays)
                    </label>
                  )}
                </div>
              </div>

              <div className="mt-5 grid md:grid-cols-2 gap-4 text-sm">
                <div className="bg-orange-50 rounded-xl p-4">
                  <div className="flex justify-between mb-2"><span>Security deposit</span><span className="font-semibold">RM {calc.secDep.toFixed(2)}</span></div>
                  <div className="flex justify-between mb-2"><span>Utilities deposit</span><span className="font-semibold">RM {calc.utilDep.toFixed(2)}</span></div>
                  <div className="flex justify-between mb-2"><span>Advance rental</span><span className="font-semibold">RM {calc.advRent.toFixed(2)}</span></div>
                  {includeStampDuty && (
                    <div className="flex justify-between mb-2"><span>Stamp duty</span><span className="font-semibold">RM {calc.stamp.toFixed(2)}</span></div>
                  )}
                  {includeAgentFee && agentPayerTenant && (
                    <div className="flex justify-between mb-2"><span>Agent fee</span><span className="font-semibold">RM {calc.agent.toFixed(2)}</span></div>
                  )}
                  <hr className="my-3" />
                  <div className="flex justify-between text-base">
                    <span>Total upfront</span>
                    <span className="font-bold text-orange-600">RM {calc.upfront.toFixed(2)}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 leading-relaxed">
                  <p className="mb-2">Malaysia common practice (guideline only): Security deposit = 2 months, Utilities deposit = 0.5 month, Advance rental = 1 month. Stamp duty per Stamps Act 1949: RM1 per RM250 of annual rent for ≤12 months; RM2 per RM250 for 1–3 years; RM3 per RM250 for 3 years.</p>
                  <p>Agent fee varies by agreement and who pays (landlord or tenant). Always verify with your agent and tenancy agreement.</p>
                </div>
              </div>
            </div>

            {/* What's nearby */}
            <div className="bg-white rounded-2xl shadow p-5 mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold">What’s nearby</h3>
                <div className="flex flex-wrap gap-2 text-sm">
                  {['food','education','health','shopping','transport'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCats(prev => ({...prev, [cat]: !prev[cat]}))}
                      className={`px-3 py-1.5 rounded-full border ${activeCats[cat] ? 'bg-orange-100 border-orange-300 text-orange-700' : 'bg-white border-gray-300 text-gray-600'}`}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>
        </div>
              <div className="rounded-xl overflow-hidden h-[420px]">
                {coords ? (
                  <MapContainer center={coords} zoom={14} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />
                    <Marker position={coords}><Popup>{property.title}</Popup></Marker>
                    {visiblePois.map(p => (
                      <Marker key={p.id} position={[p.lat, p.lon]}>
                        <Popup>
                          <div className="font-semibold mb-1">{p.title}</div>
                          <div className="text-xs text-gray-500">{p.amenity}</div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-500">Loading map…</div>
                )}
        </div>
              {loadingPois && <div className="text-xs text-gray-500 mt-2">Loading nearby places…</div>}
        </div>

        {/* Recommendations */}
            <div className="mt-8">
              <h3 className="font-bold mb-4">More places you may like</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommended.map((rec) => (
                  <button
                    key={`${rec.id}-${rec.title}`}
                    onClick={() => navigate(`/property/${rec.id}`)}
                    className="text-left bg-white rounded-xl shadow hover:shadow-lg transition p-3"
                  >
                    <img src={rec.images?.[0] || rec.image} alt={rec.title} className="w-full h-36 object-cover rounded-lg mb-3" />
                    <div className="font-semibold line-clamp-1">{rec.title}</div>
                    <div className="text-orange-500 font-bold text-sm">{rec.price}</div>
                    <div className="text-gray-500 text-xs flex gap-2 mt-1">
                      <span>🛏️ {rec.beds ?? extractBeds(rec.details)}</span>
                      <span>🛁 {rec.baths ?? extractBaths(rec.details)}</span>
                      <span>{rec.type}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button className="mt-8 px-6 py-2 bg-gray-200 rounded-full" onClick={() => navigate(-1)}>Back to Listings</button>
          </div>

          {/* Right: Agent card */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow p-5 lg:sticky lg:top-24">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gray-200" />
                <div>
                  <div className="font-semibold">{property.agent.name}</div>
                  <div className="text-sm text-gray-500">{property.agent.contact}</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mb-4">REN verified · LPPEH registered</div>
              <button
                className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-semibold shadow"
                onClick={() => window.open('https://web.whatsapp.com/', '_blank')}
              >
                WhatsApp Web
              </button>
              <div className="mt-4 text-xs text-gray-500">Other ways to enquire</div>
          </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
