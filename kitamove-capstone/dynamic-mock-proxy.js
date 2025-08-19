import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/route', async (req, res) => {
  try {
    const { from, to, date } = req.body;
    
    console.log('Request received:');
    console.log('- From:', from);
    console.log('- To:', to);
    console.log('- Date:', date);
    
    // Parse the coordinates
    const fromParts = from.split(',').map(parseFloat);
    const toParts = to.split(',').map(parseFloat);
    
    console.log('Coordinates parsed:');
    console.log('- From:', fromParts);
    console.log('- To:', toParts);
    
    // Generate a better mock response based on the actual coordinates
    const dynamicMockResponse = generateMockRoute(fromParts, toParts);
    
    // Send the mock response after a slight delay
    setTimeout(() => {
      res.json(dynamicMockResponse);
      console.log('Dynamic mock route data sent successfully');
    }, 500);
    
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Function to generate a mock route between two points
function generateMockRoute(fromCoords, toCoords) {
  const [fromLat, fromLng] = fromCoords;
  const [toLat, toLng] = toCoords;
  
  // Calculate a straight line with some intermediate points
  const numPoints = 10;
  const coordinates = [];
  
  for (let i = 0; i <= numPoints; i++) {
    // Generate points along a straight line from start to end
    const ratio = i / numPoints;
    const lat = fromLat + ratio * (toLat - fromLat);
    const lng = fromLng + ratio * (toLng - fromLng);
    
    // Add a small random offset to make the route look more natural
    // except for the start and end points
    const jitter = (i > 0 && i < numPoints) ? 0.003 * (Math.random() - 0.5) : 0;
    
    coordinates.push([lng, lat + jitter]);
  }
  
  // Calculate approximate distance in kilometers using Haversine formula
  const distance = calculateDistance(fromLat, fromLng, toLat, toLng);
  
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
              "distance": distance * 1000, // Convert to meters
              "duration": distance * 60, // Rough estimate: 1 km per minute
              "steps": [
                {
                  "distance": distance * 1000,
                  "duration": distance * 60,
                  "type": 11,
                  "instruction": "Travel from origin to destination",
                  "name": "Route",
                  "way_points": [0, numPoints]
                }
              ]
            }
          ],
          "summary": {
            "distance": distance * 1000,
            "duration": distance * 60
          },
          "way_points": [0, numPoints]
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
      "attribution": "Mock Route Generator",
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

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Dynamic route mock server running on port ${PORT}`);
});
