import AdminPanel from "./components/AdminPanel";
import ChallengeDetail from "./pages/ChallengeDetail";
import ChallengeProgress from "./pages/ChallengeProgress";
import CreateChallenge from "./pages/CreateChallenge";
import Home from "./pages/Home";
import Login from "./components/Login";
import Logout from "./components/Logout";
import MainLayout from "./Layout/MainLayout";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import ProtectedRoute from "./components/ProtectedRoute";
import WelcomeUser from "./components/WelcomeUser";
import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="logout" element={<Logout />} />
          <Route path="onboarding" element={<Onboarding />} />
          <Route path="welcomeuser" element={<WelcomeUser />} />
          <Route path="challengedetail" element={<ChallengeDetail />} />
          <Route path="challengeprogress" element={<ChallengeProgress />} />
          <Route path="createchallenge" element={<CreateChallenge />} />

          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
