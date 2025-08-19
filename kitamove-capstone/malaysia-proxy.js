import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json());

// Malaysia geo boundaries (approximate)
const MALAYSIA_BOUNDS = {
  peninsular: {
    minLat: 1.2, maxLat: 6.7,
    minLng: 99.6, maxLng: 104.5
  },
  eastMalaysia: {
    minLat: 0.85, maxLat: 7.4,
    minLng: 109.4, maxLng: 119.3
  }
};

// Major cities in Malaysia for routing waypoints
const MALAYSIA_CITIES = [
  { name: "Kuala Lumpur", lat: 3.139, lng: 101.6869 },
  { name: "Penang", lat: 5.4141, lng: 100.3288 },
  { name: "Johor Bahru", lat: 1.4927, lng: 103.7414 },
  { name: "Ipoh", lat: 4.5975, lng: 101.0901 },
  { name: "Malacca", lat: 2.1896, lng: 102.2501 },
  { name: "Kota Kinabalu", lat: 5.9804, lng: 116.0735 },
  { name: "Kuching", lat: 1.5533, lng: 110.3593 },
  { name: "Shah Alam", lat: 3.0738, lng: 101.5183 },
  { name: "Petaling Jaya", lat: 3.1073, lng: 101.6067 },
  { name: "Kuantan", lat: 3.8077, lng: 103.3260 }
];

// Malaysia major roads with approximate waypoints
const MALAYSIA_ROADS = {
  "North-South Expressway": [
    [6.4414, 100.1986], // Bukit Kayu Hitam
    [6.1184, 100.3668], // Alor Setar
    [5.4141, 100.3288], // Penang
    [4.5975, 101.0901], // Ipoh
    [3.139, 101.6869],  // Kuala Lumpur
    [2.9254, 101.6559], // Seremban
    [2.1896, 102.2501], // Malacca
    [1.8555, 102.9625], // Muar
    [1.4927, 103.7414]  // Johor Bahru
  ],
  "East Coast Expressway": [
    [3.139, 101.6869],  // Kuala Lumpur
    [3.5126, 102.1986], // Temerloh
    [3.8077, 103.3260], // Kuantan
    [4.9647, 103.4376], // Kuala Terengganu
    [6.1248, 102.2436]  // Kota Bharu
  ],
  "Pan Borneo Highway": [
    [1.5533, 110.3593], // Kuching
    [2.3089, 111.8295], // Sibu
    [3.1857, 113.0412], // Bintulu
    [4.3833, 113.9914], // Miri
    [4.9244, 114.9470], // Limbang
    [5.2756, 115.2435], // Lawas
    [5.9804, 116.0735], // Kota Kinabalu
    [5.3486, 116.4387], // Ranau
    [5.0329, 118.3237], // Sandakan
    [4.2498, 117.8871]  // Tawau
  ]
};

app.post('/api/route', async (req, res) => {
  try {
    const { from, to, date } = req.body;
    
    console.log('Request received:');
    console.log('- From:', from);
    console.log('- To:', to);
    console.log('- Date:', date);
    
    // Parse the coordinates
    const [fromLat, fromLng] = from.split(',').map(parseFloat);
    const [toLat, toLng] = to.split(',').map(parseFloat);
    
    console.log('Coordinates parsed:');
    console.log('- From:', [fromLat, fromLng]);
    console.log('- To:', [toLat, toLng]);
    
    // Validate that coordinates are within Malaysia
    if (!isInMalaysia(fromLat, fromLng) || !isInMalaysia(toLat, toLng)) {
      return res.status(400).json({ 
        error: 'Coordinates are outside of Malaysia. Please select locations within Malaysia.'
      });
    }
    
    // Try to use OSRM demo server for real routes (works for basic routing without API key)
    try {
      // Attempt to get a real route from OSRM demo server
      const osrmResponse = await fetchOSRMRoute(fromLng, fromLat, toLng, toLat);
      console.log('Successfully fetched route from OSRM');
      return res.json(convertOSRMtoORS(osrmResponse, fromLat, fromLng, toLat, toLng));
    } catch (error) {
      console.log('OSRM failed, falling back to enhanced mock routes:', error.message);
      // If OSRM fails, fall back to enhanced mock routing
    }
    
    // Generate an enhanced mock response based on Malaysia road network
    const enhancedMockResponse = generateEnhancedMalaysiaRoute(fromLat, fromLng, toLat, toLng);
    
    res.json(enhancedMockResponse);
    console.log('Enhanced Malaysia mock route data sent successfully');
    
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Check if coordinates are within Malaysia
function isInMalaysia(lat, lng) {
  // Check peninsular Malaysia
  if (lat >= MALAYSIA_BOUNDS.peninsular.minLat && 
      lat <= MALAYSIA_BOUNDS.peninsular.maxLat &&
      lng >= MALAYSIA_BOUNDS.peninsular.minLng && 
      lng <= MALAYSIA_BOUNDS.peninsular.maxLng) {
    return true;
  }
  
  // Check east Malaysia (Sabah and Sarawak)
  if (lat >= MALAYSIA_BOUNDS.eastMalaysia.minLat && 
      lat <= MALAYSIA_BOUNDS.eastMalaysia.maxLat &&
      lng >= MALAYSIA_BOUNDS.eastMalaysia.minLng && 
      lng <= MALAYSIA_BOUNDS.eastMalaysia.maxLng) {
    return true;
  }
  
  return false;
}

// Try to fetch a route from OSRM demo server
async function fetchOSRMRoute(fromLng, fromLat, toLng, toLat) {
  const url = `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`OSRM API error: ${response.status}`);
  }
  
  return await response.json();
}

// Convert OSRM response format to OpenRouteService format
function convertOSRMtoORS(osrmData, fromLat, fromLng, toLat, toLng) {
  if (!osrmData.routes || osrmData.routes.length === 0) {
    throw new Error('No routes found in OSRM response');
  }
  
  const route = osrmData.routes[0];
  const { distance, duration, geometry } = route;
  
  // Extract the bounding box from the geometry
  let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
  
  for (const coord of geometry.coordinates) {
    minLng = Math.min(minLng, coord[0]);
    minLat = Math.min(minLat, coord[1]);
    maxLng = Math.max(maxLng, coord[0]);
    maxLat = Math.max(maxLat, coord[1]);
  }
  
  // Create a simple step
  const steps = [{
    distance: distance,
    duration: duration,
    type: 11,
    instruction: "Follow the route",
    name: "Malaysia Route",
    way_points: [0, geometry.coordinates.length - 1]
  }];
  
  // Convert to the expected format
  return {
    "type": "FeatureCollection",
    "features": [
      {
        "bbox": [minLng, minLat, maxLng, maxLat],
        "type": "Feature",
        "properties": {
          "segments": [
            {
              "distance": distance,
              "duration": duration,
              "steps": steps
            }
          ],
          "summary": {
            "distance": distance,
            "duration": duration
          },
          "way_points": [0, geometry.coordinates.length - 1]
        },
        "geometry": geometry
      }
    ],
    "bbox": [minLng, minLat, maxLng, maxLat],
    "metadata": {
      "attribution": "OSRM Directions API",
      "service": "routing",
      "timestamp": Date.now(),
      "query": {
        "coordinates": [[fromLng, fromLat], [toLng, toLat]],
        "profile": "driving-car",
        "format": "json"
      }
    }
  };
}

// Generate an enhanced route based on Malaysia road networks
function generateEnhancedMalaysiaRoute(fromLat, fromLng, toLat, toLng) {
  // Find the closest major roads for start and end points
  const fromCity = findNearestCity(fromLat, fromLng);
  const toCity = findNearestCity(toLat, toLng);
  
  // Generate route waypoints based on Malaysia road network
  const waypoints = generateMalaysiaRouteWaypoints(fromLat, fromLng, toLat, toLng);
  
  // Generate the actual route coordinates with the waypoints
  const coordinates = [];
  
  // Add start point
  coordinates.push([fromLng, fromLat]);
  
  // Add waypoints
  for (const waypoint of waypoints) {
    coordinates.push([waypoint[1], waypoint[0]]);
  }
  
  // Add end point
  coordinates.push([toLng, toLat]);
  
  // Calculate approximate distance using enhanced route
  let totalDistance = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    const [lng1, lat1] = coordinates[i];
    const [lng2, lat2] = coordinates[i + 1];
    totalDistance += calculateDistance(lat1, lng1, lat2, lng2);
  }
  
  return {
    "type": "FeatureCollection",
    "features": [
      {
        "bbox": [
          Math.min(fromLng, toLng), 
          Math.min(fromLat, toLat), 
          Math.max(fromLng, toLng), 
          Math.max(fromLat, toLat)
        ],
        "type": "Feature",
        "properties": {
          "segments": [
            {
              "distance": totalDistance * 1000, // Convert to meters
              "duration": totalDistance * 60, // Rough estimate: 1 km per minute
              "steps": [
                {
                  "distance": totalDistance * 1000,
                  "duration": totalDistance * 60,
                  "type": 11,
                  "instruction": `Travel from ${fromCity.name} to ${toCity.name}`,
                  "name": "Malaysia Route",
                  "way_points": [0, coordinates.length - 1]
                }
              ]
            }
          ],
          "summary": {
            "distance": totalDistance * 1000,
            "duration": totalDistance * 60
          },
          "way_points": [0, coordinates.length - 1]
        },
        "geometry": {
          "coordinates": coordinates,
          "type": "LineString"
        }
      }
    ],
    "bbox": [
      Math.min(fromLng, toLng), 
      Math.min(fromLat, toLat), 
      Math.max(fromLng, toLng), 
      Math.max(fromLat, toLat)
    ],
    "metadata": {
      "attribution": "Malaysia Enhanced Route Generator",
      "service": "routing",
      "timestamp": Date.now(),
      "query": {
        "coordinates": [[fromLng, fromLat], [toLng, toLat]],
        "profile": "driving-car",
        "format": "json"
      }
    }
  };
}

// Find the nearest city to given coordinates
function findNearestCity(lat, lng) {
  let nearestCity = MALAYSIA_CITIES[0];
  let minDistance = calculateDistance(lat, lng, nearestCity.lat, nearestCity.lng);
  
  for (let i = 1; i < MALAYSIA_CITIES.length; i++) {
    const city = MALAYSIA_CITIES[i];
    const distance = calculateDistance(lat, lng, city.lat, city.lng);
    
    if (distance < minDistance) {
      minDistance = distance;
      nearestCity = city;
    }
  }
  
  return nearestCity;
}

// Generate waypoints for a route in Malaysia based on major roads
function generateMalaysiaRouteWaypoints(fromLat, fromLng, toLat, toLng) {
  // Determine if we're in peninsula or east Malaysia
  const isFromPeninsular = isInPeninsularMalaysia(fromLat, fromLng);
  const isToPeninsular = isInPeninsularMalaysia(toLat, toLng);
  
  // If both points are in the same region, use direct routing via major roads
  if (isFromPeninsular && isToPeninsular) {
    // Use North-South Expressway as the backbone
    return findRouteWaypointsInPeninsular(fromLat, fromLng, toLat, toLng);
  } else if (!isFromPeninsular && !isToPeninsular) {
    // Use Pan Borneo Highway as the backbone in East Malaysia
    return findRouteWaypointsInEastMalaysia(fromLat, fromLng, toLat, toLng);
  } else {
    // If crossing regions, this would require flight, but we'll just return a direct route
    return [];
  }
}

// Check if coordinates are in peninsular Malaysia
function isInPeninsularMalaysia(lat, lng) {
  return lat >= MALAYSIA_BOUNDS.peninsular.minLat && 
         lat <= MALAYSIA_BOUNDS.peninsular.maxLat &&
         lng >= MALAYSIA_BOUNDS.peninsular.minLng && 
         lng <= MALAYSIA_BOUNDS.peninsular.maxLng;
}

// Find waypoints for peninsular Malaysia routing
function findRouteWaypointsInPeninsular(fromLat, fromLng, toLat, toLng) {
  // Check north-south orientation
  const isNorthSouth = Math.abs(fromLat - toLat) > Math.abs(fromLng - toLng);
  
  // If going north-south, use North-South Expressway
  if (isNorthSouth) {
    const road = MALAYSIA_ROADS["North-South Expressway"];
    // Find nearest points on the expressway
    const nearestFromIndex = findNearestPointOnRoad(fromLat, fromLng, road);
    const nearestToIndex = findNearestPointOnRoad(toLat, toLng, road);
    
    // Get waypoints along the expressway
    return getWaypointsAlongRoad(road, nearestFromIndex, nearestToIndex);
  } else {
    // If going east-west, use East Coast Expressway
    const road = MALAYSIA_ROADS["East Coast Expressway"];
    const nearestFromIndex = findNearestPointOnRoad(fromLat, fromLng, road);
    const nearestToIndex = findNearestPointOnRoad(toLat, toLng, road);
    
    return getWaypointsAlongRoad(road, nearestFromIndex, nearestToIndex);
  }
}

// Find waypoints for east Malaysia routing
function findRouteWaypointsInEastMalaysia(fromLat, fromLng, toLat, toLng) {
  const road = MALAYSIA_ROADS["Pan Borneo Highway"];
  const nearestFromIndex = findNearestPointOnRoad(fromLat, fromLng, road);
  const nearestToIndex = findNearestPointOnRoad(toLat, toLng, road);
  
  return getWaypointsAlongRoad(road, nearestFromIndex, nearestToIndex);
}

// Find nearest point on a road
function findNearestPointOnRoad(lat, lng, road) {
  let nearestIndex = 0;
  let minDistance = calculateDistance(lat, lng, road[0][0], road[0][1]);
  
  for (let i = 1; i < road.length; i++) {
    const distance = calculateDistance(lat, lng, road[i][0], road[i][1]);
    
    if (distance < minDistance) {
      minDistance = distance;
      nearestIndex = i;
    }
  }
  
  return nearestIndex;
}

// Get waypoints along a road between two points
function getWaypointsAlongRoad(road, fromIndex, toIndex) {
  const waypoints = [];
  
  // Determine direction
  const start = Math.min(fromIndex, toIndex);
  const end = Math.max(fromIndex, toIndex);
  
  // Add points along the road
  for (let i = start; i <= end; i++) {
    waypoints.push(road[i]);
  }
  
  return waypoints;
}

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Malaysia-focused enhanced routing server running on port ${PORT}`);
});
