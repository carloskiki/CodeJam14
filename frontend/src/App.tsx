import "./App.css";
import { Routes, Route } from "react-router-dom";
import Frontpage from "./pages/frontpage";
import Detailpage from "./pages/detailpage";
import Profile from "./pages/profile";
import Mainpage from "./pages/mainpage";
import NavBar from "./components/Nav";

const App: React.FC = () => {
    const isLoggedIn = true;

    return (
        <div>
            <NavBar />

            <Routes>
                {
                    isLoggedIn ?
                        <>
                            <Route path="/" element={<Mainpage />} />
                            <Route path="/detail" element={<Detailpage />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/frontpage" element={<Frontpage />} />
                        </>
                        : <Route path="/" element={<Frontpage />} />
                }

            </Routes>
        </div>
    );
};

export default App;
