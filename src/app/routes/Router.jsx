import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoadingGrid from '../../components/common/LoadingGrid.jsx'

const Trending = lazy(() => import('../../pages/Trending/Trending.jsx'))
const Browse = lazy(() => import('../../pages/Browse/Browse.jsx'))
const Random = lazy(() => import('../../pages/Random/Random.jsx'))
const About = lazy(() => import('../../pages/About/About.jsx'))
const NotFound = lazy(() => import('../../pages/NotFound/NotFound.jsx'))

export default function Router() {
  return (
    <Suspense fallback={<LoadingGrid count={8} />}>
      <Routes>
        <Route path="/" element={<Navigate to="/trending" replace />} />
        <Route path="/trending" element={<Trending />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/random" element={<Random />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
