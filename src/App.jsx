import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import SetupPage from './pages/SetupPage'
import InterviewPage from './pages/InterviewPage'
import ResultPage from './pages/ResultPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SetupPage />} />
        <Route path="/interview" element={<InterviewPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
