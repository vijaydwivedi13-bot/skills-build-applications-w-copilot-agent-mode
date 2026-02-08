import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar bg="dark" expand="lg" sticky="top">
          <Container>
            <Navbar.Brand href="/" className="d-flex align-items-center">
              <img 
                src="/octofitapp-small.png" 
                alt="OctoFit Logo"
                className="me-3"
              />
              <h2 style={{ color: 'white', marginBottom: 0 }}>OctoFit Tracker</h2>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <Nav.Link as={Link} to="/" className="nav-link-custom">
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/users" className="nav-link-custom">
                  Users
                </Nav.Link>
                <Nav.Link as={Link} to="/teams" className="nav-link-custom">
                  Teams
                </Nav.Link>
                <Nav.Link as={Link} to="/activities" className="nav-link-custom">
                  Activities
                </Nav.Link>
                <Nav.Link as={Link} to="/workouts" className="nav-link-custom">
                  Workouts
                </Nav.Link>
                <Nav.Link as={Link} to="/leaderboard" className="nav-link-custom">
                  Leaderboard
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Routes>
          <Route
            path="/"
            element={
              <Container className="mt-5">
                <div className="text-center">
                  <h1>Welcome to OctoFit Tracker</h1>
                  <p className="lead">
                    Track your fitness activities, join teams, and compete on the leaderboard!
                  </p>
                  <p>Use the navigation menu above to explore the app.</p>
                </div>
              </Container>
            }
          />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
