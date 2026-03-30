import React from "react";

function Navbar({
  darkMode,
  setDarkMode,
  searchInput,
  setSearchInput,
  searchQuery,
  onSearch,
  onClearSearch,
  activeTab,
  setActiveTab,
  bookmarkCount,
}) {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <div className="logo">
          <span className="logo-icon">📰</span>
          <span className="logo-text">
            News<span className="logo-accent">Flow</span>
          </span>
        </div>
      </div>

      <form className="search-form" onSubmit={onSearch}>
        <input
          type="text"
          placeholder="Search any topic, person, event..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button type="button" className="clear-btn" onClick={onClearSearch}>
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
          🔖 Saved{" "}
          {bookmarkCount > 0 && (
            <span className="badge">{bookmarkCount}</span>
          )}
        </button>
        <button
          className="theme-toggle"
          onClick={() => setDarkMode((d) => !d)}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;