import React from 'react'
import Hero from '../components/Hero'
import Courses from '../components/Courses'
import ExperienceHome from '../components/ExperienceHome'
import LatestPosts from '../components/LatestPosts'
import Events from '../components/Events'

const Home = () => {
  return (
    <div>
      <Hero />
      <Courses />
      <ExperienceHome />
      <LatestPosts />
      <Events />
    </div>
  )
}

export default Home
