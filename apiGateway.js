const express = require('express');
const app = express();
const axios = require('axios');

const weatherServiceUrl = 'https://api.openweathermap.org/data/2.5/weather';
const newsServiceUrl = 'https://newsapi.org/v2/top-headlines';

const weatherApiKey = 'YOUR_OPENWEATHERMAP_API_KEY';
const newsApiKey = 'YOUR_NEWS_API_API_KEY';

// Middleware to parse JSON requests
app.use(express.json());

// Route for weather data
app.get('/weather', async (req, res) => {
  try {
    const response = await axios.get(`${weatherServiceUrl}?q=Tokyo&appid=${weatherApiKey}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Route for news data
app.get('/news', async (req, res) => {
  try {
    const response = await axios.get(`${newsServiceUrl}?country=jp&apiKey=${newsApiKey}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news data' });
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API Gateway is listening on port ${port}`);
});
