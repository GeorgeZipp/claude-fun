# 🎮 Google Trends Game Show

A comprehensive, TV-quality game show host control system for running Google Trends games, inspired by the Funhaus Google Trends series. Features a dual-interface architecture with real-time Google Trends API integration and beautiful animated visualizations.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### Dual-Interface Architecture
- **Host Control Panel**: Complete game management with all controls
- **Display Screen**: Broadcast-ready, fullscreen-capable visual output
- **Three View Modes**: Split view, host-only, or display-only

### Team Management
- Support for 2-8 teams simultaneously
- Real-time score tracking and adjustments
- Distinct team colors and customizable names
- Quick score adjustment buttons (-10, -1, +1, +5, +10)

### Round System
- Multiple round types: Standard, Naming, Bonus, Wager
- Configurable date ranges (past hour to past 5 years)
- Regional filtering (US, UK, Worldwide, etc.)
- Auto-fetch or manual entry options

### Google Trends Integration
- Automatic data fetching from Google Trends API
- Historical search interest data visualization
- Multi-line time series graphs with Recharts
- Intelligent caching system (15-minute TTL)
- Graceful fallback to manual entry

### Visual Screens
- **Welcome Screen**: Pre-game lobby with team cards
- **Reveal Screen**: Dramatic term revelation
- **Naming Screen**: Real-time team submissions display
- **Compare Screen**: Beautiful bar charts + trend graphs
- **Scoreboard**: Animated leaderboard
- **Bonus Screen**: Special bonus round presentation

### Advanced Features
- Countdown timer with visual warnings
- Wager rounds with win/loss tracking
- Bonus rounds with point multipliers
- Smooth animations with Framer Motion
- Responsive design for various screen sizes

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ and npm
- Modern web browser (Chrome, Firefox, Edge, Safari)

### Installation

```bash
# Clone or navigate to the project
cd trends-gameshow

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running the Application

**Option 1: Run both servers separately (recommended for development)**

```bash
# Terminal 1: Start backend API server
cd backend
npm start

# Terminal 2: Start frontend dev server
cd frontend
npm run dev
```

**Option 2: Use the start script (if available)**

```bash
# From project root
npm start
```

### Accessing the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Health Check: http://localhost:3001/api/health

## 📖 How to Use

### 1. Setup Phase

1. **Configure Teams**
   - Add 2-8 teams
   - Customize team names and colors
   - Set initial scores if needed

2. **Create Rounds**
   - Click "Add Round" in Round Control
   - Enter search term
   - Choose round type (Standard/Naming/Bonus/Wager)
   - Configure date range and region
   - Enable/disable auto-fetch

3. **Configure API Settings**
   - Set default date range (Past 12 Months recommended)
   - Choose default region (US, Worldwide, etc.)
   - Cache is enabled by default

### 2. Running a Game

1. **Start**: Switch to Welcome screen
2. **Reveal Term**: Navigate to Reveal screen, start timer if needed
3. **Collect Submissions** (Naming rounds):
   - Switch to Naming screen
   - Enter team phrases in Submissions Control
4. **Fetch Results**:
   - Navigate to Compare screen
   - Click "Fetch from Google Trends"
   - Review results and graphs
   - Click "Apply Points to Scores"
5. **Show Scoreboard**: Display current standings
6. **Repeat**: Navigate to next round

### 3. Display Modes

- **Split View** (default): Host panel + display side-by-side
- **Host Only**: Full screen host controls
- **Display Only**: Fullscreen output (ideal for projection/second monitor)

Use the view mode buttons in the top-right of the host panel to switch.

## 🎯 Round Types

### Standard Round
- Single term comparison
- All teams compete on same search term
- Points based on relative search interest

### Naming Round
- Teams create custom phrases
- Combines base term + team submission
- E.g., "Birth" + "Natural" = "Natural Birth"
- Most popular phrase wins

### Bonus Round
- Point multiplier (2x, 3x, etc.)
- All points earned are multiplied
- Special animated presentation

### Wager Round
- Teams bet points on their performance
- Winners gain their wager
- Losers lose their wager
- High-risk, high-reward

## 📊 Graph Visualizations

### Bar Chart
- Relative search interest (0-100 scale)
- Team colors for easy identification
- Average and peak values displayed
- Smooth animation on reveal

### Trend Graph (Line Chart)
- Multi-line time series visualization
- Search interest over time
- Interactive tooltips with exact values
- Animated line drawing effect
- Legend with team identification

## 🎨 Customization

### Team Colors
Default palette: Blue, Red, Yellow, Green, Purple, Pink, Cyan, Orange

Modify in `frontend/src/store.ts`:
```typescript
const TEAM_COLORS = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  // Add your colors here
];
```

### Display Backgrounds
Gradient backgrounds can be customized in `frontend/src/index.css`:
```css
.gradient-blue-purple {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Timer Defaults
Modify in host control panel or set programmatically in `frontend/src/store.ts`

## 🔧 API Reference

### Backend Endpoints

#### POST /api/trends/compare
Fetch Google Trends data for comparison.

**Request Body:**
```json
{
  "phrases": ["term1", "term2"],
  "dateRange": {
    "preset": "past_12_months"
  },
  "region": "US"
}
```

**Response:**
```json
{
  "results": [
    {
      "phrase": "term1",
      "averageInterest": 75,
      "peakInterest": 100,
      "peakDate": "2025-10-15",
      "relativeScore": 100,
      "dataPoints": [
        { "date": "2025-01-01", "value": 80 }
      ]
    }
  ],
  "region": "US",
  "dateRange": { ... },
  "fetchedAt": "2025-11-09T...",
  "source": "api"
}
```

#### GET /api/trends/cache/status
Get current cache status.

#### POST /api/trends/cache/clear
Clear all cached data.

#### GET /api/health
API health check.

## 🛠️ Technology Stack

### Backend
- **Node.js + Express**: API server
- **google-trends-api**: Google Trends integration
- **CORS**: Cross-origin support
- In-memory caching with TTL

### Frontend
- **React 18** with TypeScript
- **Vite**: Build tool and dev server
- **Zustand**: State management
- **Framer Motion**: Animations
- **Recharts**: Chart visualizations
- **Tailwind CSS**: Styling
- **Lucide React**: Icons

## 📁 Project Structure

```
trends-gameshow/
├── backend/
│   ├── package.json
│   └── server.js          # Express API server
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── host/      # Host control components
│   │   │   ├── screens/   # Display screen components
│   │   │   ├── HostPanel.tsx
│   │   │   └── DisplayScreen.tsx
│   │   ├── api.ts         # API client
│   │   ├── store.ts       # Zustand state management
│   │   ├── types.ts       # TypeScript types
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
└── README.md
```

## 🐛 Troubleshooting

### Google Trends API Issues

**Problem**: 403 Forbidden errors
- **Solution**: Google may be rate limiting. Wait 60 seconds and try again, or use manual entry.

**Problem**: No data returned
- **Solution**: Try a different date range or more common search terms.

**Problem**: API timeout
- **Solution**: Check your internet connection. The API has a 10-second timeout built-in.

### Frontend Issues

**Problem**: Blank screen
- **Solution**: Check browser console for errors. Ensure backend is running on port 3001.

**Problem**: Graphs not displaying
- **Solution**: Ensure results have been fetched from API (not manually entered).

**Problem**: Teams not updating
- **Solution**: Check React DevTools. Zustand state should update immediately.

### Backend Issues

**Problem**: Port 3001 already in use
- **Solution**: Change port in `backend/server.js` and update proxy in `frontend/vite.config.ts`

**Problem**: CORS errors
- **Solution**: Ensure backend CORS middleware is enabled.

## 🎯 Best Practices

1. **Use Split View** during games for full control
2. **Project Display-Only view** to a second monitor/TV
3. **Pre-create rounds** before starting the game
4. **Test API connectivity** before live gameplay
5. **Use cached results** when re-running same queries
6. **Clear cache weekly** to avoid stale data
7. **Limit teams to 4-6** for best visual presentation
8. **Use Past 12 Months** date range for most reliable data

## 📝 Game Show Tips

### Naming Round Ideas
- "Birth" → teams add adjectives
- "Dance" → teams add styles
- "Party" → teams add themes
- "Shopping" → teams add stores

### Good Search Terms
- ✅ Common nouns (birth, party, dance)
- ✅ Popular brands (Nike, Apple)
- ✅ Current events (Olympics, elections)
- ❌ Avoid very obscure terms
- ❌ Avoid misspellings

### Scoring Strategies
- Standard rounds: 10-100 points
- Bonus rounds: 2x-3x multiplier
- Wager rounds: 10-200 point range
- Adjust scores for drama!

## 🤝 Contributing

This project was built as a comprehensive example of a game show control system. Feel free to:

- Fork and modify for your own games
- Add new screen types
- Implement additional Google Trends features
- Create new round types
- Improve visualizations

## 📜 License

MIT License - feel free to use this project for any purpose!

## 🙏 Acknowledgments

- Inspired by Funhaus Google Trends gameplay
- Built with the awesome React, Recharts, and Framer Motion ecosystems
- Google Trends data via unofficial API

## 🚀 Future Enhancements

- [ ] Sound effects and audio cues
- [ ] Game replay/recording
- [ ] Export results to PDF/images
- [ ] Networked multiplayer (teams submit from devices)
- [ ] Stream overlay integration
- [ ] Mobile-responsive host panel
- [ ] Advanced statistics and analytics
- [ ] Custom themes and color schemes
- [ ] Database persistence
- [ ] User accounts and saved games

---

**Built with ❤️ for game show hosts everywhere**

For questions, issues, or suggestions, please open an issue on GitHub.
