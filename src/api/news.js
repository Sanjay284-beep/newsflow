export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  const API_KEY = "c72aff27bf6996cb9444fd335d20d27b";
  const BASE_URL = "https://gnews.io/api/v4";

  const { type, category, query } = req.query;

  let url;

  if (type === "search") {
    url = `${BASE_URL}/search?q=${encodeURIComponent(query)}&lang=en&max=18&apikey=${API_KEY}`;
  } else if (type === "india") {
    url = `${BASE_URL}/search?q=india&lang=en&country=in&max=18&apikey=${API_KEY}`;
  } else if (type === "world") {
    url = `${BASE_URL}/top-headlines?lang=en&max=18&apikey=${API_KEY}`;
  } else {
    url = `${BASE_URL}/top-headlines?category=${category}&lang=en&max=18&apikey=${API_KEY}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ errors: [err.message] });
  }
}