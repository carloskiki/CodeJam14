import "./App.css";
import { Routes, Route } from "react-router-dom";
import Frontpage from "./pages/frontpage";
import Detailpage from "./pages/detailpage";
import Profile from "./pages/profile";
import Mainpage from "./pages/mainpage";
import NavBar from "./components/Nav";
import FinishSignup from "./pages/finish-signup";
import Header from "./components/header";
import Uploadpage from "./pages/uploadpage";
import styles from "./components/ApartmentFinder.module.css";
import Navfront from "./pages/navfront";
import { LoadScript, Libraries } from "@react-google-maps/api";
import { UserProvider, useUser } from "./context/UserContext";


const mapsLibraries: Libraries = ["places"];

const AppRoutes: React.FC = () => {
  const { isLoggedIn } = useUser();

  return (
    <div className={styles.container}>
      <NavBar />
      <LoadScript
        googleMapsApiKey="AIzaSyDcwqtIoz_pE2Ylu2cxAv00XKzVqKonZSo"
        libraries={mapsLibraries}
      >
      
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/" element={<Mainpage />} />
            <Route path="/detail/:id" element={<Detailpage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/upload" element={<Uploadpage />} />
            <Route path="/frontpage" element={<Frontpage />} />
          </>
        ) : (
          <Route path="/" element={<Frontpage />} />
        )}
        <Route path="/finishSignUp" element={<FinishSignup />} />
      </Routes>
      </LoadScript>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  );
};

export default App;
