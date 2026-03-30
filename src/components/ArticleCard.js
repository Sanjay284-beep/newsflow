import React from "react";
function ArticleCard({ article, bookmarked, onBookmark }) {
  const date = new Date(article.publishedAt).toLocaleDateString("en-IN", {day: "numeric", month: "short", year: "numeric"});
  return (
    <div className="card">
      <div className="card-img-wrap">
        <img src={article.image} alt={article.title} className="card-img" onError={(e) => { e.target.src = "https://placehold.co/400x220/13131a/7a7a8c?text=No+Image"; }} />
        <button className={`bookmark-btn ${bookmarked ? "bookmarked" : ""}`} onClick={onBookmark} title={bookmarked ? "Remove bookmark" : "Save article"}>
          {bookmarked ? "🔖" : "🏷️"}
        </button>
        {article.source?.name && <span className="source-badge">{article.source.name}</span>}
      </div>
      <div className="card-body">
        <p className="card-date">{date}</p>
        <h3 className="card-title">{article.title}</h3>
        {article.description && <p className="card-desc">{article.description}</p>}
        <a href={article.url} target="_blank" rel="noreferrer" className="read-btn">Read Full Article →</a>
      </div>
    </div>
  );
}
export default ArticleCard;