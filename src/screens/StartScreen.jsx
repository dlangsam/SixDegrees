import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchPerson, getImageUrl, KEVIN_BACON_ID } from "../api/tmdb";
import { getApiKey } from "../api/apiKey";
import { setStartingActor } from "../hooks/useGameState";
import { CURATED_ACTORS } from "../utils/curatedActors";
import LoadingSpinner from "../components/LoadingSpinner";

const CURATED_ACTORS_CACHE_KEY = "curated_actors_cache";
const CACHE_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export default function StartScreen() {
  const [actor, setActor] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const getCuratedActorsData = async () => {
    // Check cache first
    const cached = localStorage.getItem(CURATED_ACTORS_CACHE_KEY);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        const age = Date.now() - timestamp;

        // Return cached data if not expired
        if (age < CACHE_EXPIRATION_MS) {
          return data;
        }

        // Expired, clear it
        localStorage.removeItem(CURATED_ACTORS_CACHE_KEY);
      } catch {
        localStorage.removeItem(CURATED_ACTORS_CACHE_KEY);
      }
    }

    // Fetch actor data for curated list
    const actorsData = [];

    for (const actorName of CURATED_ACTORS) {
      const actor = await fetchActor(actorName);
      if (actor) actorsData.push(actor);
    }

    // Cache the results with timestamp
    try {
      localStorage.setItem(
        CURATED_ACTORS_CACHE_KEY,
        JSON.stringify({
          data: actorsData,
          timestamp: Date.now()
        }),
      );
    } catch (err) {
      console.error("Failed to cache curated actors:", err);
    }

    return actorsData;
  };

  const fetchActor = async (actorName) => {
    const apiKey = getApiKey();
    try {
      const data = await searchPerson(actorName, apiKey);
      const actor = data.results.find(
        (a) => a.known_for_department === "Acting" && a.profile_path,
      );
      if (actor) {
        return actor;
      }
    } catch (err) {
      console.error(`Failed to fetch ${actorName}:`, err);
    }
  };

  const fetchRandomActor = async () => {
    setLoading(true);
    setError("");

    try {
      const curatedActors = await getCuratedActorsData();

      // Filter out Kevin Bacon
      const validActors = curatedActors.filter((a) => a.id !== KEVIN_BACON_ID);

      if (validActors.length === 0) {
        throw new Error("No valid actors found");
      }

      // Pick a random actor from the curated list
      const randomActor =
        validActors[Math.floor(Math.random() * validActors.length)];
      setActor(randomActor);
    } catch (err) {
      setError("Failed to load actor. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecificActor = async (actorName) => {
    setLoading(true);
    setError("");
    try {
      const specificActor = await fetchActor(actorName);
      if (!specificActor) {
        throw new Error("No valid actors found");
      } else if (specificActor.id === KEVIN_BACON_ID) {
        throw new Error("Cannot start with Kevin Bacon");
      }
      setActor(specificActor);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomActor();
  }, []);

  const handleStartGame = () => {
    if (actor) {
      setStartingActor(actor);
      navigate("/game");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-noir-darker">
        <LoadingSpinner text="Finding an actor..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-noir-darker px-4">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchRandomActor}
            className="bg-gold text-noir-darker font-semibold py-2 px-6 rounded-lg hover:bg-gold/90 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-noir-darker px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-display font-bold text-gold mb-4">
            Six Degrees of Kevin Bacon
          </h1>
          <p className="text-cream/70 font-body text-lg mb-6">
            Connect an actor to Kevin Bacon through movies and cast members
          </p>
        </div>

        {/* Search Box */}
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && fetchSpecificActor(searchQuery)
              }
              type="text"
              className="flex-1 px-4 py-3 bg-noir-dark border border-gold/30 rounded-lg text-cream placeholder-cream/30 focus:outline-none focus:border-gold transition-colors"
              placeholder="Search for a specific actor..."
            />
            <button
              onClick={() => fetchSpecificActor(searchQuery)}
              disabled={!searchQuery.trim()}
              className="bg-gold text-noir-darker font-semibold py-3 px-8 rounded-lg hover:bg-gold/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Search
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gold/20"></div>
          <span className="text-cream/50 text-sm">or get a random actor</span>
          <div className="flex-1 h-px bg-gold/20"></div>
        </div>

        {actor && (
          <div className="bg-noir-dark rounded-xl p-8 shadow-2xl border border-gold/20">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-48 h-64 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
                {actor.profile_path ? (
                  <img
                    src={getImageUrl(actor.profile_path, "w342")}
                    alt={actor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-noir-darker flex items-center justify-center">
                    <span className="text-cream/30 text-6xl">?</span>
                  </div>
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-4xl font-display font-bold text-cream mb-4">
                  {actor.name}
                </h2>
                {actor.known_for && actor.known_for.length > 0 && (
                  <div className="mb-6">
                    <p className="text-cream/60 text-sm mb-2">
                      Popular movies:
                    </p>
                    <p className="text-cream">
                      {actor.known_for
                        .slice(0, 3)
                        .map((item) => item.title || item.name)
                        .join(", ")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 mt-8 justify-center">
              <button
                onClick={fetchRandomActor}
                className="bg-noir-darker text-cream font-semibold py-3 px-8 rounded-lg border border-gold/30 hover:border-gold transition-all transform hover:scale-105 active:scale-95"
              >
                New Actor
              </button>
              <button
                onClick={handleStartGame}
                className="bg-gold text-noir-darker font-semibold py-3 px-8 rounded-lg hover:bg-gold/90 transition-all transform hover:scale-105 active:scale-95"
              >
                Start Game
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
