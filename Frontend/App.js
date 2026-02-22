import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './Home';
import Stickers from './Stickers';
import About from './About';
import QuranPlayer from './QuranPlayer';
import Footer from './components/Footer';
import './styles.css';

const AppContent = () => {
  const location = useLocation(); // Get the current location (page)

  // Determine the background color based on the page
  const headerClass = location.pathname === '/' ? 'header-home' : 'header-other'; 

  return (
    <div>
      <div class={`header-section ${headerClass}`}>
        <header className={`container d-flex justify-content-between align-items-center`}>
          <div className="h4 mb-0">
            <img 
              src="/logo.png" 
              alt="Logo" 
              style={{ width: '150px', height: '150px', objectFit: 'contain' }} 
            />
          </div>
          <nav>
            <ul className="nav">
              <li className="nav-item">
                <Link to="/" className="nav-link">Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/stickers" className="nav-link">Stickers</Link>
              </li>
              <li className="nav-item">
                <Link to="/about" className="nav-link">About</Link>
              </li>
              <li className="nav-item">
                <Link to="/quran" className="nav-link">Quran</Link>
              </li>
            </ul>
          </nav>
        </header>
      </div>
 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stickers" element={<Stickers />} />
        <Route path="/about" element={<About />} />
        <Route path="/quran" element={<QuranPlayer />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />  {/* The AppContent component is wrapped inside the Router */}
      <Footer />
    </Router>
  );
};

export default App;
