import React from "react";

function CategoryBar({ categories, activeCategory, onCategoryClick }) {
  return (
    <div className="categories">
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`cat-btn ${activeCategory.id === cat.id ? "active" : ""}`}
          onClick={() => onCategoryClick(cat)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}

export default CategoryBar;