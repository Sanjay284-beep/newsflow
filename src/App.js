import { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import CategoryBar from "./components/CategoryBar";
import ArticleCard from "./components/ArticleCard";
import SkeletonCard from "./components/SkeletonCard";
import useNews from "./hooks/useNews";

const CATEGORIES = [
  { id: "india",         label: "🇮🇳 India"       },
  { id: "world",         label: "🌍 World"         },
  { id: "technology",    label: "💻 Technology"    },
  { id: "business",      label: "💼 Business"      },
  { id: "sports",        label: "🏏 Sports"        },
  { id: "entertainment", label: "🎬 Entertainment" },
  { id: "health",        label: "🏥 Health"        },
  { id: "science",       label: "🔬 Science"       },
];

export default function App() {
  const [searchInput, setSearchInput]       = useState("");
  const [searchQuery, setSearchQuery]       = useState("");
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [darkMode, setDarkMode]             = useState(true);
  const [activeTab, setActiveTab]           = useState("home");
  const [bookmarks, setBookmarks]           = useState(() => {
    const saved = localStorage.getItem("newsBookmarks");
    return saved ? JSON.parse(saved) : [];
  });

  const { articles, loading, error, fetchNews } = useNews(activeCategory, searchQuery);

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
    setBookmarks((prev) => {
      const exists = prev.find((b) => b.url === article.url);
      return exists
        ? prev.filter((b) => b.url !== article.url)
        : [article, ...prev];
    });
  };

  const isBookmarked = (url) => bookmarks.some((b) => b.url === url);

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

      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        searchQuery={searchQuery}
        onSearch={handleSearch}
        onClearSearch={clearSearch}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bookmarkCount={bookmarks.length}
      />

      {activeTab === "home" && !searchQuery && (
        <CategoryBar
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onCategoryClick={handleCategory}
        />
      )}

      {searchQuery && activeTab === "home" && (
        <div className="search-banner">
          <span>🔍 Results for <strong>"{searchQuery}"</strong></span>
          <button onClick={clearSearch} className="back-btn">
            ← Back to {activeCategory.label}
          </button>
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
          <div className="articles-grid">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
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
            <button className="btn-primary" onClick={() => setActiveTab("home")}>
              Browse News
            </button>
          </div>
        )}

        {!loading && !error && displayArticles.length === 0 && activeTab !== "bookmarks" && (
          <div className="empty-state">
            <div className="empty-icon">🔎</div>
            <h3>No articles found</h3>
            <p>Try a different search term or browse a category.</p>
            <button className="btn-primary" onClick={clearSearch}>
              Clear Search
            </button>
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
        <p>
          Powered by{" "}
          <a href="https://gnews.io" target="_blank" rel="noreferrer">
            GNews API
          </a>{" "}
          · Built with React
        </p>
      </footer>
    </div>
  );
}