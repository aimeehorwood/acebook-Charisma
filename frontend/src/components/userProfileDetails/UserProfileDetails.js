import React, { useEffect, useState } from "react";

const UserProfileDetails = ({ user, image, myProfilePage, friendsView, 
  edit, friendshipStatus, friendshipRequestStatus, 
  setFriendsView, setFriendshipRequestStatus, setUpdated,
  setEdit }) => {
  const [token, setToken] = useState(window.localStorage.getItem("token"));

  const viewFriends = () => {
    setFriendsView(!friendsView);
    setUpdated(false);
  };

  const handleFriendRequest = (event, requester_id) => {
    event.preventDefault();
    if (token) {
      fetch(`http://localhost:3000/users/${requester_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          field: "request",
          requester: window.localStorage.getItem("user_id"),
        }),
      }).then((response) => {
        setFriendshipRequestStatus(true);
      });
    }
  };
  const handleEdit = () => {
    setEdit(!edit);
  };

  return (
    <>
       <h1>My details</h1>
        <br></br>
        <p>Name: {user && user.name}</p>
        <br></br>
        <p>About me: {user && user.aboutMe}</p>
        <br></br>
        <img src={image} id="profile-pics" alt="img" />
        <br></br>
        <br></br>
        {myProfilePage && (
          <div>
            {!friendsView && (
              <button id="like-button" onClick={handleEdit}>
                {edit ? "Close editing form" : "Edit profile details"}
              </button>
            )}
            {!edit && (
              <button id="like-button" onClick={viewFriends}>
                {friendsView ? "Close friends list" : "Friends List"}
              </button>
            )}
          </div>
        )}
        <br></br>
        {!myProfilePage && friendshipStatus && (
          <p>{`You and ${user.name} are friends`}</p>
        )}

        {!myProfilePage && friendshipRequestStatus && (
          <p>{`You and have requested to be friends with ${user.name}`}</p>
        )}
        {!myProfilePage && !friendshipRequestStatus && !friendshipStatus && (
          <>
            <p></p>
            <button
              id="like-button"
              onClick={(event) => handleFriendRequest(event, user._id)}
            >
              Send friend request
            </button>
          </>
        )}
    </>
  );
};

export default UserProfileDetails;
