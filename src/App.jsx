import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { hasApiKey } from './api/apiKey'
import ApiKeyScreen from './screens/ApiKeyScreen'
import StartScreen from './screens/StartScreen'
import GameScreen from './screens/GameScreen'
import ResultScreen from './screens/ResultScreen'
import Footer from './components/Footer'

function App() {
  const apiKeyExists = hasApiKey()

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <div className="flex-1">
          <Routes>
            <Route
              path="/"
              element={apiKeyExists ? <Navigate to="/start" /> : <ApiKeyScreen />}
            />
            <Route path="/start" element={<StartScreen />} />
            <Route path="/game" element={<GameScreen />} />
            <Route path="/result" element={<ResultScreen />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  )
}

export default App
