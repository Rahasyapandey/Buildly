import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Landing from './pages/Landing'
import Overview from './pages/Overview'
import Board from './pages/Board'
import NotFound from './pages/NotFound'

// App is the root component. Its only job is to set up the router
// and declare which page component renders at which URL path.
//
// Route breakdown:
//   /          → Landing page (Hero showcase with interactive diagram preview)
//   /overview  → Workspace Overview dashboard (Image 1)
//   /workspace → Alias for Workspace Overview
//   /board     → The interactive whiteboard canvas
//   *          → 404 catch-all for any unknown URL
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/workspace" element={<Overview />} />
        <Route path="/board" element={<Board />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
