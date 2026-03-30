import { useState, useEffect, useCallback } from "react";

const API_KEY = process.env.REACT_APP_NEWS_API_KEY;
const BASE_URL = "https://gnews.io/api/v4";

function useNews(activeCategory, searchQuery) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let url;

      if (searchQuery) {
        url = `${BASE_URL}/search?q=${encodeURIComponent(searchQuery)}&lang=en&max=18&apikey=${API_KEY}`;
      } else if (activeCategory.id === "india") {
        url = `${BASE_URL}/search?q=india&lang=en&country=in&max=18&apikey=${API_KEY}`;
      } else if (activeCategory.id === "world") {
        url = `${BASE_URL}/top-headlines?lang=en&max=18&apikey=${API_KEY}`;
      } else {
        url = `${BASE_URL}/top-headlines?category=${activeCategory.id}&lang=en&max=18&apikey=${API_KEY}`;
      }

      const res  = await fetch(url);
      const data = await res.json();

      if (data.errors) throw new Error(data.errors[0] || "Failed to fetch news");

      const valid = (data.articles || []).filter((a) => a.title && a.image);
      setArticles(valid);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, activeCategory]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return { articles, loading, error, fetchNews };
}

export default useNews;