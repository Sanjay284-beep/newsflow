# 📰 NewsFlow

### Modern React News Aggregator

A modern and responsive **news aggregator web application** built using **React** and **GNews API**.
It delivers **real-time global news**, category filtering, bookmarking, and dark/light mode.

🌐 **Live Demo** → [newsflow-tan.vercel.app](https://newsflow-tan.vercel.app)

---

## ✨ Features

- 🇮🇳 **India News** — Top headlines from Indian sources
- 🌍 **World News** — BBC, CNN, Reuters, Al Jazeera
- 💻 **Categories** — Technology, Business, Sports, Entertainment, Health, Science
- 🔍 **Global Search** — Search any topic, person, or event
- 🔖 **Bookmarks** — Save articles using localStorage
- 🌙 **Dark / Light Mode** — Toggle between themes
- ⚡ **Skeleton Loaders** — Smooth loading experience
- 📱 **Fully Responsive** — Works on all screen sizes

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI Framework |
| Custom Hooks | Reusable fetch logic |
| GNews API | Real-time news data |
| CSS3 | Styling & animations |
| localStorage | Bookmark storage |
| Vercel | Deployment & serverless API |

---

## 📁 Project Structure
```
newsflow
├── api
│   └── news.js          ← Vercel serverless proxy (hides API key)
├── public
│   └── index.html
├── src
│   ├── components
│   │   ├── Navbar.js
│   │   ├── CategoryBar.js
│   │   ├── ArticleCard.js
│   │   └── SkeletonCard.js
│   ├── hooks
│   │   └── useNews.js   ← custom hook for fetching news
│   ├── App.js
│   ├── App.css
│   └── index.js
├── .env                 ← API key (not committed)
├── package.json
└── README.md
```

---

## 📦 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/Sanjay284-beep/newsflow.git
cd newsflow
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create a `.env` file in the root folder
```
REACT_APP_NEWS_API_KEY=your_gnews_api_key_here
```
Get your free API key → [gnews.io](https://gnews.io)

### 4. Start the app
```bash
npm start
```

App opens at → `http://localhost:3000`

---

## 🎯 React Concepts Used

- `useState` — managing UI state
- `useEffect` — side effects & syncing
- `useCallback` — memoizing fetch function
- `Custom Hook (useNews)` — separating fetch logic
- `Props` — passing data between components
- `Conditional Rendering` — loading, error, empty states
- `localStorage` — persisting bookmarks

---

## 👨‍💻 Author

**Sanjay**
Frontend Developer

---

## 📄 License

MIT License
