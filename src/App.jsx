import "react-toastify/dist/ReactToastify.css";
import AdminPanel from "./components/AdminPanel";
import ChallengeDetail from "./pages/ChallengeDetail";
import ChallengeProgress from "./pages/ChallengeProgress";
import CreateChallenge from "./pages/CreateChallenge";
import Home from "./pages/Home";
import MainLayout from "./Layout/MainLayout";
import MapComponent from "./pages/MapComponent";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import ProtectedRoute from "./components/ProtectedRoute";
import SimpleLayout from "./Layout/SimpleLayout";
import TakeAPhoto from "./components/TakeAPhoto";
import Welcome from "./components/Welcome";
import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/start" element={<MainLayout />}>
          <Route path="home" element={<Home />} />
          <Route path="home/:id" element={<ChallengeDetail />} />
          <Route path="challengeprogress" element={<ChallengeProgress />} />
          <Route path="createchallenge" element={<CreateChallenge />} />
          <Route path="map" element={<MapComponent />} />
          <Route path="takeaphoto" element={<TakeAPhoto />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/" element={<SimpleLayout />}>
          <Route path="/" element={<Welcome />} />
          <Route path="onboarding" element={<Onboarding />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
