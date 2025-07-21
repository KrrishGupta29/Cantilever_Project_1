const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());

app.get('/api/news', async (req, res) => {
  const { category, query } = req.query;

  let url = `https://newsapi.org/v2/top-headlines?country=in&apiKey=${process.env.NEWS_API_KEY}`;
  if (category) url += `&category=${category}`;
  if (query) url += `&q=${query}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching news.' });
  }
});

app.listen(5000, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
