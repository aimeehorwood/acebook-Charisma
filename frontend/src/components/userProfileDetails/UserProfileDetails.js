import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./UserProfileDetails.css";
import CreatePost from "../createPost/CreatePost";
import Post from "../post/Post";
import FriendsList from "../friendsList/FriendsList"
import { useParams } from 'react-router-dom';


const Profile = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(window.localStorage.getItem("token"));
  const [posts, setPosts] = useState(null);
  const [updated, setUpdated] = useState(null)
  const [friendsView, setFriendsView] = useState(false)
  const [myProfilePage, setMyProfilePage] = useState(null)
  const [friendshipStatus, setFriendshipStatus] = useState(null)
  const [friendshipRequestStatus, setFriendshipRequestStatus] = useState(null)
  const [friends, setFriends] = useState(null)
  const [friendRequests, setFriendRequests] = useState(null)

  let { id } = useParams();

  
  useEffect(() => {
    if (token) {
      fetch(`/users/${id}`)
        .then((response) => response.json())
        .then(async (data) => {
          setToken(window.localStorage.getItem("token"));
          setUser(data.user);
          setMyProfilePage(id===window.localStorage.getItem("user_id"))
          await setFriendshipRequestStatus(data.user.friendRequests.includes(window.localStorage.getItem("user_id")))
          await setFriendshipStatus(data.user.friends.includes(window.localStorage.getItem("user_id")))
          console.log(data.user.friends)
          console.log(data.user.friendRequests)
          await setFriends(data.user.friends)
          await setFriendRequests(data.user.friendRequests)
          console.log(friends)
          console.log(`req status = ${friendshipRequestStatus}`)
          console.log(`friend status = ${friendshipStatus}`)
        });
    }
  }, [id,updated]);

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
          setUpdated(false)
        });
    }
  }, [updated,id,friendsView,friendshipStatus]);

  const viewFriends = () => {
    setFriendsView(!friendsView)
    setUpdated(false)
  }

  const handleFriendRequest = (event,requester_id) => {
    event.preventDefault()
    if (token) {
      fetch(`http://localhost:3000/users/${requester_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          field: 'request',
          requester: window.localStorage.getItem('user_id'),
        }),
      }).then((response) => {
        setFriendshipRequestStatus(true)
      })
    }
  }

  return (
    <>
    <div className="profile-details">
      <h1>My details</h1>
      <p>Name: {user && user.name}</p>
      <p>About me: {user && user.aboutMe}</p>
      {myProfilePage && <button onClick={viewFriends}>Friends List</button>}
    </div>
    {(!myProfilePage && friendshipStatus) && (
      `You and ${user.name} are friends`
    )}
    {(!myProfilePage && friendshipRequestStatus) && (
      `You and have requested to be friends with ${user.name}`
    )}
    {(!myProfilePage && (!friendshipRequestStatus && !friendshipStatus)) && (
      <button onClick={(event) => handleFriendRequest(event,user._id)}>Send friend request</button>
    )}
      
    
    

    {friendsView && <FriendsList userFriends={friends} userFriendRequests={friendRequests} updated={updated} setUpdated={setUpdated} currentUser={user} />}
    {!friendsView && 
      <div className="user-posts">
      <h2 id="post" className="feedHeader">My Posts</h2>
      {myProfilePage && <CreatePost setUpdated={setUpdated}/>}
            <div id='feed' role="feed">
              {posts && posts.sort(function(postA, postB) {
                return (new Date(postB.createdAt) - new Date(postA.createdAt));
              }).map(
                (post) => ( <Post setUpdated={setUpdated} post={ post } key={ post._id } /> )
              )}
          </div>
      </div>
}
      </>
  );
};

export default Profile;

