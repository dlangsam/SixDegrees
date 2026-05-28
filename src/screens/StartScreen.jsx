import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPopularActors, getImageUrl, KEVIN_BACON_ID } from '../api/tmdb'
import { getApiKey } from '../api/apiKey'
import { setStartingActor } from '../hooks/useGameState'
import LoadingSpinner from '../components/LoadingSpinner'

export default function StartScreen() {
  const [actor, setActor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const fetchRandomActor = async () => {
    setLoading(true)
    setError('')

    try {
      const apiKey = getApiKey()
      // Pick a random page from 1-5 to get variety
      const randomPage = Math.floor(Math.random() * 5) + 1
      const data = await getPopularActors(apiKey, randomPage)

      // Filter out Kevin Bacon and actors without profile images
      const validActors = data.results.filter(
        a => a.id !== KEVIN_BACON_ID && a.profile_path
      )

      if (validActors.length === 0) {
        throw new Error('No valid actors found')
      }

      // Pick a random actor from the results
      const randomActor = validActors[Math.floor(Math.random() * validActors.length)]
      setActor(randomActor)
    } catch (err) {
      setError('Failed to load actor. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRandomActor()
  }, [])

  const handleStartGame = () => {
    if (actor) {
      setStartingActor(actor)
      navigate('/game')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-noir-darker">
        <LoadingSpinner text="Finding an actor..." />
      </div>
    )
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
    )
  }

  return (
    <div className="min-h-screen bg-noir-darker px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-display font-bold text-gold mb-4">
            Six Degrees of Kevin Bacon
          </h1>
          <p className="text-cream/70 font-body text-lg">
            Connect this actor to Kevin Bacon through movies and cast members
          </p>
        </div>

        {actor && (
          <div className="bg-noir-dark rounded-xl p-8 shadow-2xl border border-gold/20">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-48 h-64 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
                {actor.profile_path ? (
                  <img
                    src={getImageUrl(actor.profile_path, 'w342')}
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
                {actor.known_for_department && (
                  <p className="text-gold text-lg mb-4">
                    Known for: {actor.known_for_department}
                  </p>
                )}
                {actor.known_for && actor.known_for.length > 0 && (
                  <div className="mb-6">
                    <p className="text-cream/60 text-sm mb-2">Popular movies:</p>
                    <p className="text-cream">
                      {actor.known_for.slice(0, 3).map(item => item.title || item.name).join(', ')}
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
                I'm Feeling Lucky
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
  )
}
