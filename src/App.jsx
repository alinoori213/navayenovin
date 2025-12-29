import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import Home from './pages/Home'
import AboutPage from './pages/AboutPage'
import CoursesPage from './pages/CoursesPage'
import ExperiencePage from './pages/ExperiencePage'
import ContactPage from './pages/ContactPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BlogPage from './pages/BlogPage'
import NewsPage from './pages/NewsPage'
import TeacherDetailPage from './pages/TeacherDetailPage'
import ScrollToTop from './components/ScrollToTop'
import './App.css'

function AppContent() {
  const location = useLocation()
  const hideNavAndFooter = location.pathname === '/login'

  return (
    <div className="App">
      <ScrollToTop />
      {!hideNavAndFooter && <Navigation />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/experience" element={<ExperiencePage />} />
        <Route path="/teachers/:id" element={<TeacherDetailPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
      {!hideNavAndFooter && <Footer />}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
