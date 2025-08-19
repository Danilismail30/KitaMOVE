import React from "react";
import { useParams, useNavigate } from "react-router-dom";

// Dummy data for demonstration
const properties = [
  {
    id: 1,
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1460518451285-97b6aa326961?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80"
    ],
    title: "The Elysia Park Residence",
    price: "RM 1,950 /mo",
    address: "Jalan Persiaran Medini Utara 1, Medini, Iskandar Puteri (Nusajaya), Johor",
    beds: 1,
    baths: 1,
    area: "520 sqft",
    type: "Condo",
    furnished: "Fully furnished",
    agent: {
      name: "Yvonne Wong",
      contact: "012-3456789"
    },
    description: "Modern condo with full amenities, close to shopping and public transport.",
    recommendations: [
      {
        id: 2,
        image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80",
        title: "Luxury Condo in KL City",
        price: "RM 4,500 /mo",
        beds: 3,
        baths: 2,
        type: "Condo"
      },
      {
        id: 3,
        image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=800&q=80",
        title: "Bungalow at Penang Hill",
        price: "RM 7,200 /mo",
        beds: 5,
        baths: 4,
        type: "Bungalow"
      }
    ]
  }
  // Add more dummy properties as needed
];

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = properties.find((p) => p.id === Number(id)) || properties[0];

  return (
    <div className="bg-[#fcf7f2] min-h-screen px-8 py-8 pt-32">
      <div className="max-w-4xl mx-auto">
        {/* Images */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {property.images.map((img, idx) => (
            <img key={idx} src={img} alt={property.title} className="rounded-xl h-40 w-full object-cover" />
          ))}
        </div>
        {/* Title & Price */}
        <h2 className="text-2xl font-bold mb-1">{property.title}</h2>
        <p className="text-gray-600 mb-2">{property.address}</p>
        <div className="text-orange-500 font-bold text-xl mb-2">{property.price}</div>
        {/* Amenities */}
        <div className="flex gap-6 mb-4">
          <div className="flex items-center gap-2"><span>🛏️</span> {property.beds} Beds</div>
          <div className="flex items-center gap-2"><span>🛁</span> {property.baths} Baths</div>
          <div className="flex items-center gap-2"><span>📐</span> {property.area}</div>
          <div className="flex items-center gap-2"><span>🏷️</span> {property.type}</div>
          <div className="flex items-center gap-2"><span>🛋️</span> {property.furnished}</div>
        </div>
        {/* Agent Info */}
        <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4 mb-6">
          <div className="font-semibold">Agent: {property.agent.name}</div>
          <div className="text-gray-500">Contact: {property.agent.contact}</div>
          <button className="bg-green-500 text-white px-4 py-2 rounded-full ml-auto" onClick={() => window.open('https://web.whatsapp.com/', '_blank')}>WhatsApp Web</button>
        </div>
        {/* Description */}
        <div className="mb-6">
          <h3 className="font-bold mb-2">About this property</h3>
          <p className="text-gray-700">{property.description}</p>
        </div>
        {/* Recommendations */}
        <div>
          <h3 className="font-bold mb-4">Recommendations</h3>
          <div className="grid grid-cols-2 gap-4">
            {property.recommendations.map((rec) => (
              <div key={rec.id} className="bg-white rounded-xl shadow p-4 flex gap-4 items-center">
                <img src={rec.image} alt={rec.title} className="w-24 h-20 object-cover rounded-lg" />
                <div>
                  <div className="font-semibold">{rec.title}</div>
                  <div className="text-orange-500 font-bold">{rec.price}</div>
                  <div className="text-gray-500 text-sm flex gap-2 mt-1">
                    <span>🛏️ {rec.beds}</span>
                    <span>🛁 {rec.baths}</span>
                    <span>{rec.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Back Button */}
        <button className="mt-8 px-6 py-2 bg-gray-200 rounded-full" onClick={() => navigate(-1)}>Back to Listings</button>
      </div>
    </div>
  );
}
