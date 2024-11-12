import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import { AuthProvider } from './contexts/AuthContext';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import About from './pages/About';
import Features from './pages/Features';
import Profile from './pages/Profile';
import Group from './pages/Group';
import AiContent from './pages/AiContent';
import AutoPost from './pages/AutoPost';
import AutoComment from './pages/AutoComment';
import Seeding from './pages/Seeding';
import { ToastProvider } from './contexts/ToastContext';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Route mặc định chuyển hướng đến /home */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            
            {/* Route login */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Route home với layout chính */}
            <Route path="/home" element={<Home />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/groups" element={<Group />} />
            <Route path="/ai-content" element={<AiContent />} />
            <Route path="/auto-post" element={<AutoPost />} />
            <Route path="/auto-comment" element={<AutoComment />} />
            <Route path="/seeding" element={<Seeding />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;