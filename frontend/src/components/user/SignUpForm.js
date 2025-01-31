import React, { useState } from "react";

const SignUpForm = ({ navigate }) => {
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [image, setImage] = useState(
    "https://www.shareicon.net/data/128x128/2016/08/01/640375_smile_512x512.png"
  );

  const handleImageChange = (event) => {
    setImage(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleAboutMeChange = (event) => {
    setAboutMe(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    setError(null);
    event.preventDefault();

    const response = await fetch("/users/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        aboutMe: aboutMe,
        friends: [],
        image: image,
      }),
    });
    const data = await response.json();
    if (response.status === 201) {
      navigate("/login");
    } else {
      setError(data.error);
      navigate("/signup");
    }
  };

  return (
    <div className="profile-details">
    <form id="form" onSubmit={handleSubmit}>
      <input
        required
        placeholder="Name"
        id="name"
        type="text"
        value={name}
        onChange={handleNameChange}
      />
      <textarea
        required
        placeholder="About me"
        id="aboutMe"
        type="text"
        value={aboutMe}
        onChange={handleAboutMeChange}
      />
      <input
        placeholder="Email"
        id="email"
        type="text"
        value={email}
        onChange={handleEmailChange}
      />
      <input
        placeholder="Password"
        id="password"
        type="password"
        value={password}
        onChange={handlePasswordChange}
      />
      <input type="submit" value="Submit" id="like-button" className="detailsSubmit"/>
      {error && <div className="error">{error}</div>}
      <div id="choosePic">
        <h5> Select a Profile Picture for your Profile </h5>
        <br></br>
        <select id="selectList" onChange={handleImageChange}>
          <option value="https://www.shareicon.net/data/128x128/2016/08/01/640375_smile_512x512.png">
            Happy
          </option>
          <option value="https://www.shareicon.net/data/128x128/2016/08/01/640384_heart_496x512.png">
            Love
          </option>
          <option value="https://www.shareicon.net/data/128x128/2016/08/01/640380_emoticon_512x512.png">
            Sad
          </option>
          <option value="https://www.shareicon.net/data/128x128/2016/08/01/640378_emoticon_512x512.png">
            Shock
          </option>
          <option value="https://www.shareicon.net/data/128x128/2016/08/01/640382_emoticon_512x512.png">
            Angry
          </option>
        </select>
        <br></br>
        <img
          src={
            "https://www.shareicon.net/data/128x128/2016/08/01/640375_smile_512x512.png"
          }
          alt="profile"
        />
        <img
          src={
            "https://www.shareicon.net/data/128x128/2016/08/01/640384_heart_496x512.png"
          }
          alt="profile"
        />
        <img
          src={
            "https://www.shareicon.net/data/128x128/2016/08/01/640380_emoticon_512x512.png"
          }
          alt="profile"
        />
        <img
          src={
            "https://www.shareicon.net/data/128x128/2016/08/01/640378_emoticon_512x512.png"
          }
          alt="profile"
        />
         <img
          src={
            "https://www.shareicon.net/data/128x128/2016/08/01/640382_emoticon_512x512.png"
          }
          alt="profile"
        />


       
      </div>
    </form>
    </div>
  );
};

export default SignUpForm;
