import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AuthProvider } from './context/AuthContext';
import { ModalProvider } from './context/ModalContext';
import PrivateRoute from './utils/PrivateRoute';
import { CommandProvider } from './context/CommandContext';
import { ImageProvider } from './context/ImageContext';
import GlobalErrorBoundary from './utils/GlobalErrorBoundary';
import { ToastProvider } from './components/ui/Toast';
import { AnimatePresence } from 'framer-motion';


const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const AppLayout = React.lazy(() => import('./layouts/AppLayout'));
const EditorLayout = React.lazy(() => import('./layouts/EditorLayout'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const EditorPage = React.lazy(() => import('./pages/EditorPage'));
const ProjectsPage = React.lazy(() => import('./pages/ProjectsPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const BatchProcessor = React.lazy(() => import('./components/features/batch/BatchProcessor'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const SignupPage = React.lazy(() => import('./pages/SignupPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));
const AiNewsPage = React.lazy(() => import('./app/ai-news/page'));
const SharedResultPage = React.lazy(() => import('./pages/SharedResultPage'));
const HistoryPage = React.lazy(() => import('./pages/HistoryPage'));
const PricingPage = React.lazy(() => import('./pages/PricingPage'));
const BlogIndex = React.lazy(() => import('./pages/BlogIndex'));
const BlogPost = React.lazy(() => import('./pages/BlogPost'));
const CopilotHistoryPage = React.lazy(() => import('./pages/CopilotHistoryPage'));
const LegalPage = React.lazy(() => import('./pages/LegalPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const CareersPage = React.lazy(() => import('./pages/CareersPage'));
const HelpCenter = React.lazy(() => import('./pages/HelpCenter'));
const DocsPage = React.lazy(() => import('./pages/DocsPage'));
const PressPage = React.lazy(() => import('./pages/PressPage'));
import { CopilotWidget } from './components/copilot/CopilotWidget';
import { ToastSystem } from './components/ToastSystem';
import GlobalLoader from './components/ui/GlobalLoader';

import { ThemeProvider } from './context/ThemeContext';
import './styles/theme-system.css';
// Admin Components (Hidden Portal — NO links anywhere in public UI)
const AdminGuard = React.lazy(() => import('./admin/components/AdminGuard'));
const AdminLayout = React.lazy(() => import('./admin/layouts/AdminLayout'));
const AdminLoginPage = React.lazy(() => import('./admin/pages/AdminLoginPage'));
const AdminDashboard = React.lazy(() => import('./admin/pages/Dashboard'));
const AdminUsersPage = React.lazy(() => import('./admin/pages/Users'));
const JobsPage = React.lazy(() => import('./admin/pages/Jobs'));
const AdminActivityPage = React.lazy(() => import('./admin/pages/ActivityPage'));
const AdminAnalyticsPage = React.lazy(() => import('./admin/pages/AnalyticsPage'));
const AIInsightsPage = React.lazy(() => import('./admin/pages/AIInsightsPage'));
const SystemHealthPage = React.lazy(() => import('./admin/pages/SystemHealthPage'));

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Wrapper to provide location to Routes if needed at a higher level
function AppRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/ai-news" element={<AiNewsPage />} />
      <Route path="/blog" element={<BlogIndex />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/careers" element={<CareersPage />} />
      <Route path="/legal/:section" element={<LegalPage />} />
      <Route path="/help" element={<HelpCenter />} />
      <Route path="/support" element={<HelpCenter />} />
      <Route path="/docs" element={<DocsPage />} />
      <Route path="/press" element={<PressPage />} />
      <Route path="/share/:id" element={<SharedResultPage />} />
      {/* App Layout (No Sidebar) */}
      <Route
        path="/app"
        element={
          <PrivateRoute>
            <AppLayout key="app-layout" />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="batch" element={<BatchProcessor />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="copilot-history" element={<CopilotHistoryPage />} />
        <Route path="pricing" element={<PricingPage />} />
      </Route>

      {/* Editor Layout (With Tool Sidebar) */}
      <Route
        path="/app/restoration"
        element={
          <PrivateRoute>
            <EditorLayout key="editor-layout" />
          </PrivateRoute>
        }
      >
        <Route index element={<EditorPage />} />
      </Route>

      {/* ═══ HIDDEN ADMIN PORTAL ═══ */}
      {/* Admin Login (public — separate from user login) */}
      <Route path="/admin-fixpix-secure-portal-9x7/login" element={<AdminLoginPage />} />

      {/* Admin Panel Routes (protected by admin JWT) */}
      <Route
        path="/admin-fixpix-secure-portal-9x7"
        element={
          <AdminGuard>
            <AdminLayout />
          </AdminGuard>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="jobs" element={<JobsPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="insights" element={<AIInsightsPage />} />
        <Route path="activity" element={<AdminActivityPage />} />
        <Route path="system" element={<SystemHealthPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalErrorBoundary>
        <ThemeProvider>
          <ToastProvider>
            <ModalProvider>
              <Router>
                <ScrollToTop />
                <AuthProvider>
                  <ImageProvider>
                    <CommandProvider>
                      <a
                        href="#main-content"
                        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-white focus:outline-none"
                      >
                        Skip to main content
                      </a>
                      <React.Suspense fallback={<GlobalLoader />}>
                        <AppRoutes />
                        <CopilotWidget />
                        <ToastSystem />
                      </React.Suspense>
                    </CommandProvider>
                  </ImageProvider>
                </AuthProvider>
              </Router>
            </ModalProvider>
          </ToastProvider>
        </ThemeProvider>
      </GlobalErrorBoundary>
    </QueryClientProvider>
  );
}


export default App;

