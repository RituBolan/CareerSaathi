import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";

import Dashboard from "./pages/Dashboard";
import AIAnalyze from "./pages/AIAnalyze";
import AICoverLetter from "./pages/AICoverLetter";
import Roadmap from "./pages/Roadmap";
import Profile from "./pages/Profile";
import ResumeBuilder from "./pages/ResumeBuilder";
import ScanHistory from "./pages/ScanHistory";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { useApp } from "./context/AppContext";

function ProtectedRoute({ children }) {
  const { user, userLoading } = useApp();

  if (userLoading) {
    return <div className="px-6 py-10 text-slate-400">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function GuestRoute({ children }) {
  const { user, userLoading } = useApp();

  if (userLoading) {
    return <div className="px-6 py-10 text-slate-400">Loading...</div>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/signup" element={<GuestRoute><SignUp /></GuestRoute>} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/ai-analyze" element={<ProtectedRoute><AIAnalyze /></ProtectedRoute>} />
          <Route path="/ai-cover-letter" element={<ProtectedRoute><AICoverLetter /></ProtectedRoute>} />
          <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/resume-builder" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
          <Route path="/scan-history" element={<ProtectedRoute><ScanHistory /></ProtectedRoute>} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
