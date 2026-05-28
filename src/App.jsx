import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { hasApiKey } from './api/apiKey'
import ApiKeyScreen from './screens/ApiKeyScreen'
import StartScreen from './screens/StartScreen'
import GameScreen from './screens/GameScreen'
import ResultScreen from './screens/ResultScreen'

function App() {
  const apiKeyExists = hasApiKey()

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={apiKeyExists ? <Navigate to="/start" /> : <ApiKeyScreen />}
        />
        <Route path="/start" element={<StartScreen />} />
        <Route path="/game" element={<GameScreen />} />
        <Route path="/result" element={<ResultScreen />} />
      </Routes>
    </Router>
  )
}

export default App
