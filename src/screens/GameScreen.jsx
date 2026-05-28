import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGameState,
  selectActor,
  setWon,
  setLost,
} from "../hooks/useGameState";
import { getCachedActorMovies, getCachedMovieCast } from "../api/cache";
import { getApiKey } from "../api/apiKey";
import { getImageUrl, KEVIN_BACON_ID } from "../api/tmdb";
// import PathTrail from "../components/PathTrail";
import DegreesBadge from "../components/DegreesBadge";
import MovieCard from "../components/MovieCard";
import ActorCard from "../components/ActorCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function GameScreen() {
  const gameState = useGameState();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [cast, setCast] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect to start if no game in progress
  useEffect(() => {
    if (!gameState.startingActor) {
      navigate("/start");
    }
  }, [gameState.startingActor, navigate]);

  // Fetch movies for current actor when in movie_pick phase
  useEffect(() => {
    if (gameState.phase === "movie_pick" && gameState.currentActor) {
      fetchMovies();
    }
  }, [gameState.phase, gameState.currentActor]);

  const fetchMovies = async () => {
    setLoading(true);
    setError("");
    try {
      const apiKey = getApiKey();
      const actorMovies = await getCachedActorMovies(
        gameState.currentActor.id,
        apiKey,
      );

      if (actorMovies.length === 0) {
        setError("No movies found for this actor");
      } else {
        setMovies(actorMovies); // Show all movies
      }
    } catch (err) {
      setError("Failed to load movies");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = async (movie) => {
    setSelectedMovie(movie);
    setLoading(true);
    setError("");

    try {
      const apiKey = getApiKey();
      const movieCast = await getCachedMovieCast(movie.id, apiKey);

      if (movieCast.length === 0) {
        setError("No cast found for this movie");
        setLoading(false);
        return;
      }

      // Check if Kevin Bacon is in the cast - auto-complete if so
      const kevinBacon = movieCast.find((actor) => actor.id === KEVIN_BACON_ID);
      if (kevinBacon) {
        selectActor(kevinBacon, movie);
        setWon();
        navigate("/result");
        return;
      }

      setCast(movieCast);
    } catch (err) {
      setError("Failed to load cast");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleActorClick = (actor) => {
    if (!selectedMovie) return;

    // Check if Kevin Bacon
    if (actor.id === KEVIN_BACON_ID) {
      selectActor(actor, selectedMovie);
      setWon();
      navigate("/result");
      return;
    }

    // Select the actor
    selectActor(actor, selectedMovie);

    // Check if we've reached 6 degrees (the new path length)
    const newDegreesUsed = gameState.path.length + 1;
    if (newDegreesUsed >= 6) {
      setLost();
      navigate("/result");
      return;
    }

    // Continue game with new actor
    setSelectedMovie(null);
    setCast([]);
  };

  const handleBackToMovies = () => {
    setSelectedMovie(null);
    setCast([]);
  };

  if (!gameState.startingActor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-noir-darker px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-display font-bold text-gold">
            Six Degrees of Kevin Bacon
          </h1>
          <DegreesBadge degrees={gameState.degreesUsed} />
        </div>

        {/* Path Trail - Removed (degrees badge is sufficient) */}
        {/* <div className="mb-8">
          <PathTrail
            startingActor={gameState.startingActor}
            path={gameState.path}
            currentActor={gameState.currentActor}
          />
        </div> */}

        {/* Phase 1: Movie Pick */}
        {!selectedMovie && (
          <div>
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-display text-cream mb-2">
                Choose a movie featuring{" "}
                <span className="text-gold">{gameState.currentActor.name}</span>
              </h2>
              <p className="text-cream/60">
                Pick a movie that might connect to Kevin Bacon
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner text="Loading movies..." />
              </div>
            ) : error ? (
              <div className="text-center text-red-400 py-12">{error}</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {movies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onClick={() => handleMovieClick(movie)}
                    className="aspect-[2/3]"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Phase 2: Actor Pick */}
        {selectedMovie && (
          <div>
            <div className="mb-6 text-center">
              <button
                onClick={handleBackToMovies}
                className="text-gold hover:underline mb-4"
              >
                ← Back to movies
              </button>
              <h2 className="text-2xl font-display text-cream mb-2">
                Choose an actor from{" "}
                <span className="text-gold">{selectedMovie.title}</span>
              </h2>
              <p className="text-cream/60">
                Select the next actor in your path to Kevin Bacon
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner text="Loading cast..." />
              </div>
            ) : error ? (
              <div className="text-center text-red-400 py-12">{error}</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {cast.map((actor) => (
                  <ActorCard
                    key={actor.id}
                    actor={actor}
                    onClick={() => handleActorClick(actor)}
                    className="aspect-[2/3]"
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
