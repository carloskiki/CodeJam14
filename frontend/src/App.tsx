import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import Frontpage from "./pages/frontpage";
import Detailpage from "./pages/detailpage";
import Profile from "./pages/profile";
import Mainpage from "./pages/mainpage";
import NavBar from "./components/Nav";
import FinishSignup from "./pages/finish-signup";
import Header from "./components/header";
import { useState } from "react";
import Uploadpage from "./pages/uploadpage";
import styles from "./components/ApartmentFinder.module.css";
import Navfront from "./pages/navfront";
import { LoadScript, Libraries } from "@react-google-maps/api";

const mapsLibraries: Libraries = ["places"];

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(true);

  return (
    <div className={styles.container}>
      <NavBar />
      <LoadScript
        googleMapsApiKey="AIzaSyDcwqtIoz_pE2Ylu2cxAv00XKzVqKonZSo"
        libraries={mapsLibraries}
      >
      
      <Routes>
        {loggedIn ? (
          <>
            <Route path="/" element={<Mainpage />} />
            <Route path="/detail/:id" element={<Detailpage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/upload" element={<Uploadpage />} />
            <Route 
              path="/frontpage" 
              element={<Frontpage />} 
            />
          </>
        ) : (
          <Route 
            path="/" 
            element={<Frontpage />} 
          />
        )}
        <Route path="/finishSignUp" element={<FinishSignup setLoggedIn={setLoggedIn} />} />
      </Routes>
      </LoadScript>
    </div>
  );
};

export default App;
