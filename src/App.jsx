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
import ProtectedLayout from "./Layout/ProtectedLayout";
import PublicLayout from "./Layout/PublicLayout";
import SimpleLayout from "./Layout/SimpleLayout";
import TakeAPhoto from "./components/TakeAPhoto";
import Welcome from "./components/Welcome";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route
        path="/start"
        element={
          <ProtectedLayout>
            <MainLayout />
          </ProtectedLayout>
        }
      >
        <Route path="home" element={<Home />} />
        <Route path="home/:id" element={<ChallengeDetail />} />
        <Route path="challengeprogress" element={<ChallengeProgress />} />
        <Route path="createchallenge" element={<CreateChallenge />} />
        <Route path="map" element={<MapComponent />} />
        <Route path="takeaphoto" element={<TakeAPhoto />} />
        <Route path="dashboard" element={<AdminPanel />} />
        <Route path="onboarding" element={<Onboarding />} />
      </Route>

      <Route
        path="/"
        element={
          <PublicLayout>
            <SimpleLayout />
          </PublicLayout>
        }
      >
        <Route index element={<Welcome />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
