import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Landing from './pages/Landing'
import Board from './pages/Board'
import NotFound from './pages/NotFound'

// App is the root component. Its only job is to set up the router
// and declare which page component renders at which URL path.
//
// Route breakdown:
//   /        → Landing page (the public-facing entry point)
//   /board   → The whiteboard workspace (Phase 2 target)
//   *        → 404 catch-all for any unknown URL
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/board" element={<Board />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
