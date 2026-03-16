import { lazy, Suspense } from 'react';
import './assets/css/App.css';
import Alert from './components/layout/Alert';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import OnboardingModal from './components/layout/OnboardingModal';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const AboutPage = lazy(() => import('./pages/AboutPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
import { useAlert } from './hooks/useAlert';
import { useTheme } from './hooks/useTheme';
import { useAuth } from './hooks/useAuth';
import useGamification from './hooks/useGamification';
import { ROUTES } from './constants';

function App() {
  const { alert, showAlert } = useAlert();
  const { mode, setMode } = useTheme(showAlert);
  const { user, isAuthenticated } = useAuth();
  const gamification = useGamification();

  const handleOnboardingComplete = (persona) => {
    gamification.setPersona(persona);
  };

  return (
    <Router>
      {!gamification.onboarded && (
        <OnboardingModal onComplete={handleOnboardingComplete} />
      )}

      <Navbar showAlert={showAlert} />
      <Alert alert={alert} />
      <Suspense fallback={null}>
        <Routes>
          <Route
            exact
            path={ROUTES.HOME}
            element={<Home mode={mode} setMode={setMode} showAlert={showAlert} gamification={gamification} user={user} isAuthenticated={isAuthenticated} />}
          />
          <Route
            exact
            path={ROUTES.ABOUT}
            element={<AboutPage mode={mode} />}
          />
          <Route
            path={ROUTES.LOGIN}
            element={<LoginPage showAlert={showAlert} />}
          />
          <Route
            path={ROUTES.SIGNUP}
            element={<SignupPage showAlert={showAlert} />}
          />
          <Route
            path={ROUTES.DASHBOARD}
            element={<DashboardPage gamification={gamification} user={user} isAuthenticated={isAuthenticated} showAlert={showAlert} mode={mode} setMode={setMode} />}
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
