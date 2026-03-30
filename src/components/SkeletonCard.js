import React from "react";

function SkeletonCard() {
  return (
    <div className="card skeleton-card">
      <div className="skeleton skeleton-img"></div>
      <div className="card-body">
        <div className="skeleton skeleton-date"></div>
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-title short"></div>
        <div className="skeleton skeleton-desc"></div>
        <div className="skeleton skeleton-desc short"></div>
        <div className="skeleton skeleton-btn"></div>
      </div>
    </div>
  );
}

export default SkeletonCard;