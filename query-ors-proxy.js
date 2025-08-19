import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// OpenRouteService API key
const API_KEY = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjEyMGU1Mjg3ODJmMjRmMDlhNjk3ZGIxOGQzNTcxMDZiIiwiaCI6Im11cm11cjY0In0=';

app.post('/api/route', async (req, res) => {
  try {
    const { from, to, date } = req.body;
    
    console.log('Request received:');
    console.log('From:', from);
    console.log('To:', to);
    console.log('Date:', date);
    
    // Parse coordinates
    const parseCoords = (coordStr) => {
      const [lat, lng] = coordStr.split(',').map(parseFloat);
      return [lng, lat]; // OpenRouteService uses [longitude, latitude] format
    };
    
    const fromCoords = parseCoords(from);
    const toCoords = parseCoords(to);
    
    console.log('Parsed coordinates:');
    console.log('From:', fromCoords);
    console.log('To:', toCoords);
    
    // Call OpenRouteService API with API key as query parameter
    const routeUrl = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${API_KEY}`;
    const response = await fetch(routeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        coordinates: [fromCoords, toCoords]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouteService API error:', errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const routeData = await response.json();
    console.log('Route successfully calculated');
    res.json(routeData);
    
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Query-based ORS proxy server running on port ${PORT}`);
});
