import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { validateApiKey } from '../api/tmdb'
import { setApiKey as saveApiKey } from '../api/apiKey'
import LoadingSpinner from '../components/LoadingSpinner'

export default function ApiKeyScreen() {
  const [apiKey, setApiKey] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!apiKey.trim()) {
      setError('Please enter an API key')
      return
    }

    setIsValidating(true)
    const isValid = await validateApiKey(apiKey.trim())
    setIsValidating(false)

    if (isValid) {
      saveApiKey(apiKey.trim())
      navigate('/start')
    } else {
      setError('Invalid API key. Please check and try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-noir-darker">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-display font-bold text-gold mb-4">
            Six Degrees of
            <br />
            Kevin Bacon
          </h1>
          <p className="text-cream/70 font-body">
            Navigate from a random actor to Kevin Bacon through movies and cast members
          </p>
        </div>

        {isValidating ? (
          <LoadingSpinner text="Validating API key..." />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-cream mb-2">
                TMDB API Key
              </label>
              <input
                type="text"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-4 py-3 bg-noir-dark border border-gold/30 rounded-lg text-cream placeholder-cream/30 focus:outline-none focus:border-gold transition-colors"
                placeholder="Enter your API key"
              />
              {error && (
                <p className="mt-2 text-sm text-red-400">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gold text-noir-darker font-semibold py-3 px-6 rounded-lg hover:bg-gold/90 transition-all transform hover:scale-105 active:scale-95"
            >
              Start Playing
            </button>

            <div className="text-sm text-cream/50 space-y-2">
              <p className="font-semibold text-cream/70">Don't have an API key?</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Create a free account at <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">themoviedb.org</a></li>
                <li>Go to Settings → API → Request an API Key</li>
                <li>Copy the API Key (v3 auth)</li>
              </ol>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
