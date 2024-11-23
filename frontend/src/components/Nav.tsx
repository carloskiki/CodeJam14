import "../App.css";
import { Link } from "react-router-dom";

const Nav: React.FC = () => {
  return (
    <div>
      {/* Navigation Bar */}
      <nav>
        <ul style={{ display: "flex", gap: "10px", listStyle: "none" }}>
          <li>
            <Link to="/frontpage">Frontpage</Link>
          </li>
          <li>
            <Link to="/detail">Detailpage</Link>
          </li>
          <li>
            <Link to="/">Mainpage</Link>
          </li>
          <li>
            <Link to="/profile">Update Profile</Link>
          </li>
          <li>
            <Link to="/upload">Upload</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Nav;
