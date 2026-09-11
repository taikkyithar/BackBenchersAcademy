import { StrictMode, Suspense, lazy, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import './index.css'

// Route-level code splitting: three.js only loads on pages that draw 3D, pdf.js only in the reader.
const Home = lazy(() => import('./pages/Home'))
const GradePage = lazy(() => import('./pages/Grade'))
const SubjectPage = lazy(() => import('./pages/Subject'))
const ReaderPage = lazy(() => import('./pages/Reader'))
const LessonPage = lazy(() => import('./pages/Lesson'))
const wrap = (el: ReactNode) => <Suspense fallback={<div className="notice">…</div>}>{el}</Suspense>

const router = createHashRouter([
  {
    path: '/', element: <App />,
    children: [
      { index: true, element: wrap(<Home />) },
      { path: 'grade/:grade', element: wrap(<GradePage />) },
      { path: 'grade/:grade/:subject', element: wrap(<SubjectPage />) },
      { path: 'read/:id', element: wrap(<ReaderPage />) },
      { path: 'lesson/:id', element: wrap(<LessonPage />) },
    ],
  },
])

createRoot(document.getElementById('root')!).render(<StrictMode><RouterProvider router={router} /></StrictMode>)
