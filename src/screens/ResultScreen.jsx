import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getGameState, resetGame } from '../hooks/useGameState'
import { useBidirectionalBFS } from '../hooks/useBidirectionalBFS'
import { getImageUrl, KEVIN_BACON_ID } from '../api/tmdb'
import { getCachedActorMovies, getCachedMovieCast } from '../api/cache'
import { getApiKey } from '../api/apiKey'
import BfsProgress from '../components/BfsProgress'

export default function ResultScreen() {
  const navigate = useNavigate()
  const gameState = getGameState()
  const [actorCache, setActorCache] = useState({})
  const [kevinBacon, setKevinBacon] = useState(null)

  const { status, optimalPath, progress } = useBidirectionalBFS(
    gameState.startingActor?.id,
    true // Auto-start BFS
  )

  // Debug: log the optimal path
  useEffect(() => {
    if (optimalPath) {
      console.log('Optimal path:', optimalPath)
    }
  }, [optimalPath])

  // Fetch Kevin Bacon's data
  useEffect(() => {
    const fetchKevinBacon = async () => {
      try {
        const apiKey = getApiKey()
        const response = await fetch(
          `https://api.themoviedb.org/3/person/${KEVIN_BACON_ID}?api_key=${apiKey}`
        )
        const data = await response.json()
        setKevinBacon(data)
      } catch (err) {
        console.error('Failed to fetch Kevin Bacon:', err)
      }
    }
    fetchKevinBacon()
  }, [])

  // Redirect if no game state
  useEffect(() => {
    if (!gameState.startingActor || (gameState.phase !== 'won' && gameState.phase !== 'lost')) {
      navigate('/start')
    }
  }, [gameState, navigate])

  // Cache actor data for optimal path display
  useEffect(() => {
    if (optimalPath) {
      cacheActorsFromPath(optimalPath)
    }
  }, [optimalPath])

  const cacheActorsFromPath = async (path) => {
    const cache = {}
    const apiKey = getApiKey()

    // Get starting actor
    cache[gameState.startingActor.id] = gameState.startingActor

    // Get Kevin Bacon
    const kevinBaconMovies = await getCachedActorMovies(KEVIN_BACON_ID, apiKey)
    cache[KEVIN_BACON_ID] = {
      id: KEVIN_BACON_ID,
      name: 'Kevin Bacon',
      profile_path: null // Will be filled from cast data
    }

    // Get actors from each step in the path
    for (const step of path) {
      try {
        const cast = await getCachedMovieCast(step.movie.id, apiKey)
        const actor = cast.find(a => a.id === step.nextActorId)
        if (actor && !cache[actor.id]) {
          cache[actor.id] = actor
        }
        // Also cache the starting actor of this step
        const fromActor = cast.find(a => a.id === step.actorId)
        if (fromActor && !cache[fromActor.id]) {
          cache[fromActor.id] = fromActor
        }
      } catch (err) {
        console.error('Error caching actor:', err)
      }
    }

    setActorCache(cache)
    console.log('Actor cache:', cache)
  }

  const handlePlayAgain = () => {
    resetGame()
    navigate('/start')
  }

  const playerDegrees = gameState.degreesUsed
  const optimalDegrees = optimalPath ? optimalPath.length : null

  if (!gameState.startingActor) {
    return null
  }

  return (
    <div className="min-h-screen bg-noir-darker px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-display font-bold text-gold text-center mb-8">
          Results
        </h1>

        {/* Challenge Summary */}
        <div className="flex items-center justify-center gap-8 mb-12">
          {/* Starting Actor */}
          <div className="text-center">
            <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg border-4 border-gold mb-3 mx-auto">
              {gameState.startingActor.profile_path ? (
                <img
                  src={getImageUrl(gameState.startingActor.profile_path, 'w185')}
                  alt={gameState.startingActor.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-noir-dark flex items-center justify-center">
                  <span className="text-cream/30 text-4xl">?</span>
                </div>
              )}
            </div>
            <p className="text-cream font-semibold">{gameState.startingActor.name}</p>
            <p className="text-cream/60 text-sm">Start</p>
          </div>

          {/* Arrow */}
          <div className="text-gold text-4xl pb-8">→</div>

          {/* Kevin Bacon */}
          <div className="text-center">
            <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg border-4 border-gold mb-3 mx-auto">
              {kevinBacon?.profile_path ? (
                <img
                  src={getImageUrl(kevinBacon.profile_path, 'w185')}
                  alt="Kevin Bacon"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-noir-dark flex items-center justify-center">
                  <span className="text-cream font-semibold text-lg">KB</span>
                </div>
              )}
            </div>
            <p className="text-cream font-semibold">Kevin Bacon</p>
            <p className="text-cream/60 text-sm">Target</p>
          </div>
        </div>

        {/* Player's Path */}
        <div className="bg-noir-dark rounded-xl p-8 shadow-2xl border border-gold/20 mb-8">
          <h2 className="text-3xl font-display text-cream mb-4 text-center">
            {gameState.phase === 'won' ? (
              <>
                You got there in{' '}
                <span className="text-gold">{playerDegrees}</span>{' '}
                {playerDegrees === 1 ? 'degree' : 'degrees'}!
              </>
            ) : (
              <>
                <span className="text-gold">Good try!</span> You reached 6 degrees without finding Kevin Bacon.
              </>
            )}
          </h2>

          <div className="space-y-4 mt-8">
            {/* Starting actor */}
            <PathStep
              actor={gameState.startingActor}
              isFirst
            />

            {/* Each step - show movie and the TO actor */}
            {gameState.path.map((step, index) => {
              // The TO actor is either the next step's FROM actor,
              // or Kevin Bacon if won, or the current actor if lost
              let toActor
              if (index < gameState.path.length - 1) {
                toActor = gameState.path[index + 1].actor
              } else if (gameState.phase === 'won') {
                toActor = kevinBacon || { id: KEVIN_BACON_ID, name: 'Kevin Bacon' }
              } else {
                toActor = gameState.currentActor
              }

              return (
                <div key={index}>
                  <PathMovie movie={step.movie} />
                  <PathStep
                    actor={toActor}
                    isLast={gameState.phase === 'won' && toActor.id === KEVIN_BACON_ID}
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* Optimal Path Section */}
        <div className="bg-noir-dark rounded-xl p-8 shadow-2xl border border-gold/20">
          <h2 className="text-3xl font-display text-cream mb-4 text-center">
            Optimal Path
          </h2>

          <BfsProgress progress={progress} status={status} />

          {status === 'done' && optimalPath && (
            <div className="mt-8">
              <div className="text-center mb-6">
                <p className="text-2xl text-gold mb-2">
                  Shortest path: {optimalDegrees} {optimalDegrees === 1 ? 'degree' : 'degrees'}
                </p>
                {playerDegrees === optimalDegrees ? (
                  <p className="text-green-400 text-xl font-semibold">
                    🎉 You found the optimal path!
                  </p>
                ) : (
                  <p className="text-cream/70">
                    You were {playerDegrees - optimalDegrees} {playerDegrees - optimalDegrees === 1 ? 'degree' : 'degrees'} away from optimal
                  </p>
                )}
              </div>

              <div className="space-y-4">
                {/* Starting actor */}
                <PathStep
                  actor={gameState.startingActor}
                  isFirst
                />

                {/* Optimal path steps */}
                {optimalPath.map((step, index) => {
                  // Use kevinBacon state if this is Kevin Bacon, otherwise use cache
                  const nextActor = step.nextActorId === KEVIN_BACON_ID && kevinBacon
                    ? kevinBacon
                    : (actorCache[step.nextActorId] || {
                        id: step.nextActorId,
                        name: 'Unknown Actor'
                      })

                  return (
                    <div key={index}>
                      <PathMovie movie={step.movie} />
                      <PathStep
                        actor={nextActor}
                        isLast={step.nextActorId === KEVIN_BACON_ID}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {status === 'failed' && (
            <div className="text-center py-8">
              <p className="text-cream/70">
                Couldn't find a shorter path — impressive routing!
              </p>
            </div>
          )}
        </div>

        {/* Play Again Button */}
        <div className="text-center mt-8">
          <button
            onClick={handlePlayAgain}
            className="bg-gold text-noir-darker font-semibold text-lg py-4 px-12 rounded-lg hover:bg-gold/90 transition-all transform hover:scale-105 active:scale-95"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  )
}

function PathStep({ actor, isFirst, isLast }) {
  const imageUrl = getImageUrl(actor.profile_path, 'w185')

  return (
    <div className="flex items-center gap-4 py-2">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={actor.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-gold/30"
        />
      )}
      <div className="flex-1">
        <p className="text-cream font-semibold text-lg">
          {actor.name}
          {isFirst && <span className="text-gold text-sm ml-2">(Start)</span>}
          {isLast && <span className="text-gold text-sm ml-2">(Target)</span>}
        </p>
      </div>
    </div>
  )
}

function PathMovie({ movie }) {
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : ''

  return (
    <div className="flex items-center gap-4 py-3 pl-8 border-l-2 border-gold/30 ml-8">
      <div className="text-gold text-2xl">→</div>
      <p className="text-cream/80 italic">
        {movie.title} {year && `(${year})`}
      </p>
    </div>
  )
}
