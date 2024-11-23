// import './App.css'

// import { Routes, Route } from 'react-router-dom';
// import Frontpage from './pages/frontpage';
// import Detailpage from './pages/detailPage';
// import Profile from './pages/profile';
// import Mainpage from './pages/mainpage';

// const init: React.FC = () => {
//   return(
//     <div>
//       <Routes>
//         <Route path="/frontpage" element={<Frontpage />} />
//         <Route path="/detailpage" element={<Detailpage />} />
//         <Route path="/mainpage" element={<Mainpage />} />
//         <Route path="/profile" element={<Profile />} />

//       </Routes>
//     </div>
//   );
// };

// function App() {
//   return (
//     <div>
//       <Routes>
        
//       </Routes>
//     </div>
//   );
// }

// export default App

import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import Frontpage from './pages/frontpage';
import Detailpage from './pages/detailPage';
import Profile from './pages/profile';
import Mainpage from './pages/mainpage';

const Init: React.FC = () => {
  return (
    <div>
      {/* Navigation Bar */}
      <nav>
        <ul style={{ display: 'flex', gap: '10px', listStyle: 'none' }}>
          <li>
            <Link to="/frontpage">Frontpage</Link>
          </li>
          <li>
            <Link to="/detailpage">Detailpage</Link>
          </li>
          <li>
            <Link to="/mainpage">Mainpage</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
        </ul>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/frontpage" element={<Frontpage />} />
        <Route path="/detailpage" element={<Detailpage />} />
        <Route path="/mainpage" element={<Mainpage />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
};

// function App() {
//   return (
//     <div>
//       <Routes>
//         {/* This could eventually be extended for layouts or redirects */}
//       </Routes>
//     </div>
//   );
// }

export default Init;

