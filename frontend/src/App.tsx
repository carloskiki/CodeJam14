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
import styles from "./components/ApartmentFinder.module.css";

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(true);

  return (
    <div className={styles.container}>
      <NavBar />
      <Header />
      <Routes>
        {loggedIn ? (
          <>
            <Route path="/" element={<Mainpage />} />
            <Route path="/detail/:id" element={<Detailpage />} />
            <Route path="/profile" element={<Profile />} />
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
    </div>
  );
};

export default App;
