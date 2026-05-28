# Six Degrees of Kevin Bacon 🎬

A browser-based guessing game where you navigate from a randomly assigned actor to Kevin Bacon by picking movies and cast members. The game uses bidirectional BFS to compute the optimal path and shows you how close you got!

## Features

- 🎲 **Random or Custom Start** - Choose from curated famous actors or search for your own
- 🎯 **6 Degrees Maximum** - True to the original concept
- 🔍 **Real Movie Data** - Powered by TMDB API with complete filmographies
- 🚀 **Optimal Path Finder** - Bidirectional BFS computes the shortest path
- 🎨 **Retro Hollywood Theme** - Beautiful noir-inspired design
- 📱 **Mobile Responsive** - Play on any device

## Demo

[Live Demo](https://sixdegreesofkevinbacon.netlify.app/)

## Getting Started

### Prerequisites

- Node.js 20+
- A free TMDB API key

### Get Your TMDB API Key

1. Create a free account at [themoviedb.org](https://www.themoviedb.org)
2. Go to Settings → API → Request an API Key (choose "Developer")
3. Copy the **API Key (v3 auth)**

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd six-degrees
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

4. Add your TMDB API key to `.env`:

```
VITE_TMDB_API_KEY=your_api_key_here
```

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:5173](http://localhost:5173) in your browser

## How to Play

1. **Start**: You'll be shown a random famous actor (or search for one)
2. **Choose Movies**: Select a movie that actor appeared in
3. **Choose Actors**: Pick an actor from that movie's cast
4. **Repeat**: Keep connecting through movies until you reach Kevin Bacon!
5. **Results**: See your path and compare it to the optimal path

## Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **API**: TMDB (The Movie Database)
- **Algorithm**: Bidirectional BFS for optimal path finding

## Project Structure

```
src/
├── api/           # TMDB API helpers and caching
├── components/    # Reusable React components
├── screens/       # Main app screens
├── hooks/         # Custom React hooks (game state, BFS)
├── utils/         # Utilities (BFS algorithm, curated actors)
└── data/          # Static data files
```

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

MIT

## Acknowledgments

- [TMDB](https://www.themoviedb.org) for the amazing movie database API
- Inspired by the classic "Six Degrees of Kevin Bacon" game
- Built with ❤️ and [Claude Code](https://claude.ai/code)

## Performance Notes

- **Caching**: SessionStorage caches API responses for faster gameplay
- **BFS Optimization**: Bidirectional search reduces search space by ~50%
- **Parallel Fetching**: All API calls within a BFS level run in parallel
- **1-Degree Skip**: BFS doesn't run for 1-degree wins (already optimal)

---
