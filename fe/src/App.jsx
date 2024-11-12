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
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Route mặc định chuyển hướng đến /login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Route login */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Route home với layout chính */}
          <Route path="/home" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;