import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import AuthModal from './components/Auth/AuthModal'
import OAuthCallbackHandler from './components/Auth/OAuthCallbackHandler'
import './App.css'
import Landing from './pages/Landing'
import Overview from './pages/Overview'
import Board from './pages/Board'
import Play from './pages/Play'
import NotFound from './pages/NotFound'

// App is the root component. Its only job is to set up the router,
// theme provider, auth provider, and declare which page component renders at which URL path.
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <OAuthCallbackHandler />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/workspace" element={<Overview />} />
            <Route path="/board" element={<Board />} />
            <Route path="/play" element={<Play />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AuthModal />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
