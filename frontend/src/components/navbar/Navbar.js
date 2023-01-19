import React from "react";
import { Link } from "react-router-dom";
import logo from "./acebook_logo.png"
import logo2 from "./acebook_white.png"


const Navbar = () => {
  const handleLogout = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user_id")
  };

  if (window.localStorage.getItem("token")) {
    return (
      
      <nav className="navbar">
         <a>
            <img src={logo} alt="logo"/>
          </a>
        <div className="links">
       
          <li>
            <Link to="/posts">Posts</Link>
          </li>
          <li>
            <Link to={`profile/${window.localStorage.getItem("user_id")}`}>My Profile</Link>
          </li>
          <li>
            <Link to="/" onClick={handleLogout}>
              Logout
            </Link>
          </li>
        </div>
      </nav>
    
    );
  } else {
    return (
      <nav className="navbar">
        <div className="links">
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/signup">Sign Up</Link>
          </li>
        </div>
      </nav>
    );
  }
};

export default Navbar;
