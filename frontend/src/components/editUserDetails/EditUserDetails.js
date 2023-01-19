import React, { useState } from "react";

const EditUserDetails = ({ currentUser, setEdit, setUpdated }) => {
  const [error, setError] = useState(null);
  const [email, setEmail] = useState(currentUser.email);
  const [name, setName] = useState(currentUser.name);
  const [aboutMe, setAboutMe] = useState(currentUser.aboutMe);
  const [image, setImage] = useState(currentUser.image);
  const [token, setToken] = useState(window.localStorage.getItem('token'))

  const handleImageChange = (event) => {
    if (event.target.value==="noChange") {
      return
    } else {
      setImage(event.target.value);
    }
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

  const handleSubmit = async (event) => {
    setError(null);
    event.preventDefault();

    const response = await fetch(`/users/profile/${currentUser._id}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: name,
        email: email,
        aboutMe: aboutMe,
        image: image,
      }),
    });

    const data = await response.json();
    if (response.status === 200) {
      setToken(response.token)
      setUpdated(true)
      setEdit(false)
    } else {
      setError(data.error);
    }
  };

  return (
    <form id="form" onSubmit={handleSubmit}>
      <input
        required
        placeholder="Name"
        id="name"
        type="text"
        value={name}
        onChange={handleNameChange}
      />
      <input
        required
        placeholder="About me"
        id="aboutMe"
        type="text"
        value={aboutMe}
        onChange={handleAboutMeChange}
      />
      <input
        required
        placeholder="Email"
        id="email"
        type="text"
        value={email}
        onChange={handleEmailChange}
      />
      <input id="like-button" type="submit" value="Submit" />
      {error && <div className="error">{error}</div>}
      <div>
        <h5> Select a Profile Picture for your Profile </h5>
        <br></br>
        <img
          src={
            "https://www.shareicon.net/data/128x128/2016/11/28/857788_animal_512x512.png"
          }
          alt="profile"
        />
        <img
          src={
            "https://www.shareicon.net/data/128x128/2016/11/28/857792_animal_512x512.png"
          }
          alt="profile"
        />
        <img
          src={
            "https://www.shareicon.net/data/128x128/2016/12/20/863853_snake_512x512.png"
          }
          alt="profile"
        />
        <img
          src={
            "https://www.shareicon.net/data/128x128/2017/01/06/868266_bug_512x512.png"
          }
          alt="profile"
        />        
        
        <select id="selectList" onChange={handleImageChange}>
          <option value="noChange">
            Don't change Profile picture
          </option>
          <option value="https://www.shareicon.net/data/128x128/2016/11/28/857788_animal_512x512.png">
            Option 1
          </option>
          <option value="https://www.shareicon.net/data/128x128/2016/11/28/857792_animal_512x512.png">
            Option 2
          </option>
          <option value="https://www.shareicon.net/data/128x128/2016/12/20/863853_snake_512x512.png">
            Option 3
          </option>
          <option value="https://www.shareicon.net/data/128x128/2017/01/06/868266_bug_512x512.png">
            Option 4
          </option>
        </select>
      </div>
    </form>
  );
};

export default EditUserDetails;
