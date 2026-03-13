import { useState, useEffect, useCallback } from "react";
import "./App.css";

const API_KEY = "c72aff27bf6996cb9444fd335d20d27b";
const BASE_URL = "https://gnews.io/api/v4";

const CATEGORIES = [
  { id: "india", label: "🇮🇳 India", query: "india", type: "search" },
  { id: "world", label: "🌍 World", query: null, type: "world" },
  { id: "technology", label: "💻 Technology", query: null, type: "category" },
  { id: "business", label: "💼 Business", query: null, type: "category" },
  { id: "sports", label: "🏏 Sports", query: null, type: "category" },
  { id: "entertainment", label: "🎬 Entertainment", query: null, type: "category" },
  { id: "health", label: "🏥 Health", query: null, type: "category" },
  { id: "science", label: "🔬 Science", query: null, type: "category" },
];

export default function App() {

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [darkMode, setDarkMode] = useState(true);

  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem("newsBookmarks");
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState("home");

  const fetchNews = useCallback(async () => {

    setLoading(true);
    setError("");

    try {

      let url;

      if (searchQuery) {
        url = `${BASE_URL}/search?q=${encodeURIComponent(searchQuery)}&lang=en&max=24&token=${API_KEY}`;
      }

      else if (activeCategory.type === "search") {
        url = `${BASE_URL}/search?q=${activeCategory.query}&lang=en&max=24&token=${API_KEY}`;
      }

      else if (activeCategory.type === "world") {
        url = `${BASE_URL}/top-headlines?lang=en&max=24&token=${API_KEY}`;
      }

      else {
        url = `${BASE_URL}/top-headlines?category=${activeCategory.id}&lang=en&max=24&token=${API_KEY}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (!data.articles) throw new Error("Failed to fetch news");

      const validArticles = data.articles.filter(
        a => a.title && a.image
      );

      setArticles(validArticles);

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }

  }, [searchQuery, activeCategory]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("newsBookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setSearchQuery(searchInput.trim());
    setActiveTab("home");
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchInput("");
  };

  const toggleBookmark = (article) => {
    setBookmarks(prev => {
      const exists = prev.find(b => b.url === article.url);
      return exists
        ? prev.filter(b => b.url !== article.url)
        : [article, ...prev];
    });
  };

  const isBookmarked = (url) => bookmarks.some(b => b.url === url);

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    setSearchQuery("");
    setSearchInput("");
    setActiveTab("home");
  };

  const displayArticles = activeTab === "bookmarks" ? bookmarks : articles;

  const pageTitle = () => {
    if (activeTab === "bookmarks") return "Saved Articles";
    if (searchQuery) return `Search: "${searchQuery}"`;
    return activeCategory.label + " News";
  };

  return (

    <div className={`app ${darkMode ? "dark" : "light"}`}>

      <nav className="navbar">

        <div className="logo">
          📰 News<span className="logo-accent">Flow</span>
        </div>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search news..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="search-input"
          />

          {searchQuery && (
            <button type="button" className="clear-btn" onClick={clearSearch}>
              ✕
            </button>
          )}

          <button type="submit" className="search-btn">
            🔍
          </button>
        </form>

        <div className="nav-right">

          <button
            className={`tab-btn ${activeTab === "home" ? "active" : ""}`}
            onClick={() => setActiveTab("home")}
          >
            Home
          </button>

          <button
            className={`tab-btn ${activeTab === "bookmarks" ? "active" : ""}`}
            onClick={() => setActiveTab("bookmarks")}
          >
            🔖 Saved {bookmarks.length > 0 && <span className="badge">{bookmarks.length}</span>}
          </button>

          <button
            className="theme-toggle"
            onClick={() => setDarkMode(d => !d)}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

        </div>

      </nav>

      {activeTab === "home" && !searchQuery && (

        <div className="categories">

          {CATEGORIES.map(cat => (

            <button
              key={cat.id}
              className={`cat-btn ${activeCategory.id === cat.id ? "active" : ""}`}
              onClick={() => handleCategory(cat)}
            >
              {cat.label}
            </button>

          ))}

        </div>

      )}

      <main className="main">

        <h1 className="page-title">{pageTitle()}</h1>

        {loading && (
          <p>Fetching latest news...</p>
        )}

        {error && (
          <div className="error-box">
            <p>{error}</p>
            <button onClick={fetchNews}>Try Again</button>
          </div>
        )}

        {!loading && !error && displayArticles.length > 0 && (

          <div className="articles-grid">

            {displayArticles.map((article, i) => (

              <ArticleCard
                key={article.url + i}
                article={article}
                bookmarked={isBookmarked(article.url)}
                onBookmark={() => toggleBookmark(article)}
              />

            ))}

          </div>

        )}

      </main>

      <footer className="footer">
        Powered by GNews • Built with React
      </footer>

    </div>
  );
}

function ArticleCard({ article, bookmarked, onBookmark }) {

  const date = new Date(article.publishedAt).toLocaleDateString("en-IN");

  return (

    <div className="card">

      <img
        src={article.image}
        alt={article.title}
        className="card-img"
      />

      <div className="card-body">

        <p className="card-date">{date}</p>

        <h3 className="card-title">{article.title}</h3>

        {article.description && (
          <p className="card-desc">{article.description}</p>
        )}

        <a
          href={article.url}
          target="_blank"
          rel="noreferrer"
          className="read-btn"
        >
          Read Full Article →
        </a>

        <button
          className="bookmark-btn"
          onClick={onBookmark}
        >
          {bookmarked ? "🔖" : "🏷️"}
        </button>

      </div>

    </div>
  );
}