import "./App.css";
import LoginForm from "../auth/LoginForm";
import SignUpForm from "../user/SignUpForm";
// import React, { useState } from "react";
import Feed from "../feed/Feed";
import Home from "../home/Home";
import Navbar from "../navbar/Navbar";
import Profile from "../userProfile/UserProfile"

import { useNavigate, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <>    
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Home navigate={useNavigate()} />} />
          <Route path="/feed" element={<Feed navigate={useNavigate()} />} />
          <Route
            path="/login"
            element={<LoginForm navigate={useNavigate()} />}
          />
          <Route
            path="/signup"
            element={<SignUpForm navigate={useNavigate()} />}
          />
          <Route
            path="/profile/:id"
            element={<Profile navigate={useNavigate()} />}
          />
        </Routes>
      </div>
    </>
  );
};

export default App;
