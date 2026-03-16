import './assets/css/App.css';
import Alert from './components/Alert';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import OnboardingModal from './components/OnboardingModal';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
    </Router>
  );
}

export default App;
