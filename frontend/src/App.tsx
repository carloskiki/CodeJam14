import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import Frontpage from "./pages/frontpage";
import Detailpage from "./pages/detailpage";
import Profile from "./pages/profile";
import Mainpage from "./pages/mainpage";
import Login from "./pages/login";
import NavBar from "./components/Nav";

const App: React.FC = () => {
  return (
    <div>
      <NavBar />
      <Frontpage />
    </div>
  );
};

export default App;
