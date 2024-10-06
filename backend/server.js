const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Calendar API');
});

app.get('/api/events', async (req, res) => {
  const { access_token } = req.query;

  if (!access_token) {
    return res.status(400).json({ error: 'Missing access token' });
  }

  try {
    const response = await axios.get('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    res.json(response.data); // Send the events data to the frontend
  } catch (error) {
    console.error('Error fetching events:', error.message);
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
});

app.post('/api/token', async (req, res) => {
  const { code } = req.body;
  console.log('Authorization code received:', code); // Log the received code

  try {
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    console.log('Token exchange successful:', response.data); // Log the response from Google
    res.json(response.data);
  } catch (error) {
    console.error('Error exchanging token:', error.response ? error.response.data : error.message);
    res.status(500).json({
      message: 'Error exchanging token',
      error: error.response ? error.response.data : error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
