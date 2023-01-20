import React, { useEffect, useState } from "react";
import "./UserProfile.css";
import CreatePost from "../createPost/CreatePost";
import Post from "../post/Post";
import FriendsList from "../friendsList/FriendsList";
import { useParams } from "react-router-dom";
import EditUserDetails from "../editUserDetails/EditUserDetails";
import UserProfileDetails from '../userProfileDetails/UserProfileDetails'

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
    setFriendsView(false)
  },[id])


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


  return (
    <>
      <div className="profile-details">
      <UserProfileDetails user={user} image={image} myProfilePage={myProfilePage} friendsView={friendsView} 
        edit={edit} friendshipStatus={friendshipStatus} friendshipRequestStatus={friendshipRequestStatus} 
        setFriendsView={setFriendsView} setFriendshipRequestStatus={setFriendshipRequestStatus} setUpdated={setUpdated}
        setEdit={setEdit} />
  
        {edit && (
          <EditUserDetails
            setEdit={setEdit}
            setUpdated={setUpdated}
            currentUser={user}
          />
        )}

        {friendsView && (
          <FriendsList
            setFriendsView={setFriendsView}
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
          {posts && <h2 id="post" className="feedHeader">
          {posts.length === 0 ? 'No posts yet...' : 'My Posts'}
          </h2>}
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
