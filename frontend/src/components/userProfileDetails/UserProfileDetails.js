import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./UserProfileDetails.css";
import CreatePost from "../createPost/CreatePost";
import Post from "../post/Post";
import FriendsList from "../friendsList/FriendsList";
import { useParams } from "react-router-dom";
import EditUserDetails from "../editUserDetails/EditUserDetails";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(window.localStorage.getItem("token"));
  const [posts, setPosts] = useState(null);
  const [updated, setUpdated] = useState(null);
  const [edit, setEdit] = useState(false);
  const [friendsView, setFriendsView] = useState(false);
  const [myProfilePage, setMyProfilePage] = useState(null);
  const [friendshipStatus, setFriendshipStatus] = useState(null);
  const [friendshipRequestStatus, setFriendshipRequestStatus] = useState(null);
  const [friends, setFriends] = useState(null);
  const [friendRequests, setFriendRequests] = useState(null);
  const [image, setImageUrl] = useState("");

  let { id } = useParams();

  useEffect(() => {
    if (token) {
      fetch(`/users/${id}`)
        .then((response) => response.json())
        .then(async (data) => {
          setToken(window.localStorage.getItem("token"));
          setUser(data.user);

          setMyProfilePage(id === window.localStorage.getItem("user_id"));
          await setFriendshipRequestStatus(
            data.user.friendRequests.includes(
              window.localStorage.getItem("user_id")
            )
          );
          await setFriendshipStatus(
            data.user.friends.includes(window.localStorage.getItem("user_id"))
          );

          await setFriends(data.user.friends);
          await setFriendRequests(data.user.friendRequests);
          setImageUrl(data.user.image);
        });
    }
  }, [id, updated]);

  useEffect(() => {
    if (token) {
      fetch(`/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then(async (data) => {
          window.localStorage.setItem("token", data.token);
          setToken(window.localStorage.getItem("token"));
          await setPosts(data.posts);
          setUpdated(false);
        });
    }
  }, [updated, id, friendsView, friendshipStatus]);

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
      <div className="profile-details">
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

        {edit && (
          <EditUserDetails
            setEdit={setEdit}
            setUpdated={setUpdated}
            currentUser={user}
          />
        )}

        {friendsView && (
          <FriendsList
            userFriends={friends}
            userFriendRequests={friendRequests}
            updated={updated}
            setUpdated={setUpdated}
            currentUser={user}
          />
        )}
      </div>
      {!(friendsView || edit) && (
        <div className="user-posts">
          <h2 id="post" className="feedHeader">
            My Posts
          </h2>
          {myProfilePage && <CreatePost setUpdated={setUpdated} />}
          <div id="feed" role="feed">
            {posts &&
              posts
                .sort(function (postA, postB) {
                  return new Date(postB.createdAt) - new Date(postA.createdAt);
                })
                .map((post) => (
                  <div key={post._id}>
                    <Post
                      setUpdated={setUpdated}
                      myProfilePage={myProfilePage}
                      post={post}
                    />
                  </div>
                ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
