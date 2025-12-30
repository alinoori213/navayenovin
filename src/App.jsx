import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { SettingsProvider } from './context/SettingsContext'
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
import BlogPostPage from './pages/BlogPostPage'
import NewsPostPage from './pages/NewsPostPage'
import TeacherDetailPage from './pages/TeacherDetailPage'
import ProfilePage from './pages/ProfilePage'
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
        <Route path="/blog/:id" element={<BlogPostPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id" element={<NewsPostPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      {!hideNavAndFooter && <Footer />}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Router>
          <AppContent />
        </Router>
      </SettingsProvider>
    </AuthProvider>
  )
}

export default App
