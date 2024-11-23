import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import Frontpage from "./pages/frontpage";
import Detailpage from "./pages/detailpage";
import Profile from "./pages/profile";
import Mainpage from "./pages/mainpage";
import NavBar from "./components/Nav";
import Login from './pages/login';
import Signup from './pages/signup';
import FinishSignup from "./pages/finish-signup";
import { useState } from "react";

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(true);
  const navigate = useNavigate();

  // Implement the navigation function
  const handleNavigate = (view: "login" | "signup") => {
    navigate(`/${view}`);
  };

  return (
    <div>
      <NavBar />
      <Routes>
        {loggedIn ? (
          <>
            <Route path="/" element={<Mainpage />} />
            <Route path="/detail" element={<Detailpage />} />
            <Route path="/profile" element={<Profile />} />
            <Route 
              path="/frontpage" 
              element={<Frontpage navigateTo={handleNavigate} />} 
            />
            <Route path="/login" element={<Login />} />
          </>
        ) : (
          <Route 
            path="/" 
            element={<Frontpage navigateTo={handleNavigate} />} 
          />
        )}
        <Route path="/signup" element={<Signup />} />
        <Route path="/finishSignUp" element={<FinishSignup setLoggedin={setLoggedIn} />} />
      </Routes>
    </div>
  );
};

export default App;
