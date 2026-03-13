import { useState, useEffect, useCallback } from "react";
import "./App.css";

const API_KEY = "c72aff27bf6996cb9444fd335d20d27b";
const BASE_URL = "/api/news";

const CATEGORIES = [
  { id: "india",         label: "🇮🇳 India",       },
  { id: "world",         label: "🌍 World",         },
  { id: "technology",    label: "💻 Technology",    },
  { id: "business",      label: "💼 Business",      },
  { id: "sports",        label: "🏏 Sports",        },
  { id: "entertainment", label: "🎬 Entertainment", },
  { id: "health",        label: "🏥 Health",        },
  { id: "science",       label: "🔬 Science",       },
];

export default function App() {
  const [articles, setArticles]         = useState([]);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [searchInput, setSearchInput]   = useState("");
  const [searchQuery, setSearchQuery]   = useState("");
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [darkMode, setDarkMode]         = useState(true);
  const [bookmarks, setBookmarks]       = useState(() => {
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
        url = `${BASE_URL}?type=search&query=${encodeURIComponent(searchQuery)}`;
      } else if (activeCategory.id === "india") {
        url = `${BASE_URL}?type=india`;
      } else if (activeCategory.id === "world") {
        url = `${BASE_URL}?type=world`;
      } else {
        url = `${BASE_URL}?type=category&category=${activeCategory.id}`;
      }

      const res  = await fetch(url);
      const data = await res.json();

      if (data.errors) throw new Error(data.errors[0] || "Failed to fetch news");

      const valid = (data.articles || []).filter(a => a.title && a.image);
      setArticles(valid);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, activeCategory]);

  useEffect(() => { fetchNews(); }, [fetchNews]);

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
      return exists ? prev.filter(b => b.url !== article.url) : [article, ...prev];
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
        <div className="nav-left">
          <div className="logo">
            <span className="logo-icon">📰</span>
            <span className="logo-text">News<span className="logo-accent">Flow</span></span>
          </div>
        </div>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search any topic, person, event..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button type="button" className="clear-btn" onClick={clearSearch}>✕</button>
          )}
          <button type="submit" className="search-btn">🔍</button>
        </form>

        <div className="nav-right">
          <button className={`tab-btn ${activeTab === "home" ? "active" : ""}`} onClick={() => setActiveTab("home")}>Home</button>
          <button className={`tab-btn ${activeTab === "bookmarks" ? "active" : ""}`} onClick={() => setActiveTab("bookmarks")}>
            🔖 Saved {bookmarks.length > 0 && <span className="badge">{bookmarks.length}</span>}
          </button>
          <button className="theme-toggle" onClick={() => setDarkMode(d => !d)}>
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

      {searchQuery && activeTab === "home" && (
        <div className="search-banner">
          <span>🔍 Showing results across all sources for <strong>"{searchQuery}"</strong></span>
          <button onClick={clearSearch} className="back-btn">← Back to {activeCategory.label}</button>
        </div>
      )}

      <main className="main">
        <div className="page-header">
          <h1 className="page-title">{pageTitle()}</h1>
          {activeTab !== "bookmarks" && !loading && (
            <span className="article-count">{displayArticles.length} articles</span>
          )}
        </div>

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Fetching latest news...</p>
          </div>
        )}

        {error && !loading && (
          <div className="error-box">
            <span>⚠️</span>
            <p>{error}</p>
            <button onClick={fetchNews}>Try Again</button>
          </div>
        )}

        {activeTab === "bookmarks" && bookmarks.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔖</div>
            <h3>No saved articles yet</h3>
            <p>Click the bookmark icon on any article to save it here.</p>
            <button className="btn-primary" onClick={() => setActiveTab("home")}>Browse News</button>
          </div>
        )}

        {!loading && !error && displayArticles.length === 0 && activeTab !== "bookmarks" && (
          <div className="empty-state">
            <div className="empty-icon">🔎</div>
            <h3>No articles found</h3>
            <p>Try a different search term or browse a category.</p>
            <button className="btn-primary" onClick={clearSearch}>Clear Search</button>
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
        <p>Powered by <a href="https://gnews.io" target="_blank" rel="noreferrer">GNews API</a> · Built with React</p>
      </footer>
    </div>
  );
}

function ArticleCard({ article, bookmarked, onBookmark }) {
  const date = new Date(article.publishedAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric"
  });

  return (
    <div className="card">
      <div className="card-img-wrap">
        <img
          src={article.image}
          alt={article.title}
          className="card-img"
          onError={e => { e.target.src = "https://placehold.co/400x220/13131a/7a7a8c?text=No+Image"; }}
        />
        <button
          className={`bookmark-btn ${bookmarked ? "bookmarked" : ""}`}
          onClick={onBookmark}
          title={bookmarked ? "Remove bookmark" : "Save article"}
        >
          {bookmarked ? "🔖" : "🏷️"}
        </button>
        {article.source?.name && (
          <span className="source-badge">{article.source.name}</span>
        )}
      </div>
      <div className="card-body">
        <p className="card-date">{date}</p>
        <h3 className="card-title">{article.title}</h3>
        {article.description && <p className="card-desc">{article.description}</p>}
        <a href={article.url} target="_blank" rel="noreferrer" className="read-btn">
          Read Full Article →
        </a>
      </div>
    </div>
  );
}