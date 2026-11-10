import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import ResumeUpload from './pages/ResumeUpload';
import ResumeCheck from './pages/ResumeCheck';
import CoverLetter from './pages/CoverLetter';
import InterviewPrep from './pages/InterviewPrep';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import ToastProvider from './components/ToastProvider';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-accent-fg"
        >
          Skip to content
        </a>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
          <Route path="/resume" element={<ProtectedRoute><ResumeUpload /></ProtectedRoute>} />
          <Route path="/resume-check" element={<ProtectedRoute><ResumeCheck /></ProtectedRoute>} />
          <Route path="/cover-letter" element={<ProtectedRoute><CoverLetter /></ProtectedRoute>} />
          <Route path="/interview-prep" element={<ProtectedRoute><InterviewPrep /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
