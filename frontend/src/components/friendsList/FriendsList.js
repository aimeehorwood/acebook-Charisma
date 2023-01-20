import React, { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';
import './friendsList.css';


const FriendsList = ( { userFriends, userFriendRequests, setUpdated, updated, setFriendsView } ) => {
  const [token, setToken] = useState(window.localStorage.getItem("token"));
  const [friends, setFriends] = useState(userFriends)
  const [friendObjects, setFriendObjects] = useState([])
  const [friendRequests, setFriendRequests] = useState(userFriendRequests)
  const [friendRequestObjects, setFriendRequestObjects] = useState([]) 
  
  let { id } = useParams();

  const fetchFriend = async (friendId) => {
    if (friendId && token) {
    const response = await fetch(`/users/${friendId}`);
    const data = await response.json();
    return data.user;
  }
  }

  const friendsPromiseArray = friends.map(async (friend) => await fetchFriend(friend))
  const friendRequestsPromiseArray = friendRequests.map(async (friendRequest) => await fetchFriend(friendRequest))
  
 useEffect(() => {
    Promise.all(friendRequestsPromiseArray).then(resolvedData => setFriendRequestObjects(resolvedData))
  }, [friendRequests, updated]) 

  useEffect(() => {
    Promise.all(friendsPromiseArray).then(resolvedData => setFriendObjects(resolvedData))
  }, [friends, updated])


  const handleAccept = (event,requester_id) => {
    event.preventDefault()
    if (token) {
      fetch(`http://localhost:3000/users/${requester_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          field: 'accept',
          requester: id,
        }),
      }).then((response) => {
        setFriendRequests((prevFriendRequests) => {
          const updatedFriendRequests = prevFriendRequests.filter((request) => request !== requester_id);
          return updatedFriendRequests;
        });
        setFriends(prevFriends => prevFriends.concat(requester_id))
        setUpdated(true)
      })
    }
  }

  const handleReject = (event,requester_id) => {
    event.preventDefault()
    if (token) {
      fetch(`http://localhost:3000/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          field: 'reject',
          requester: requester_id,
        }),
      }).then((response) => {
        setFriendRequests((prevFriendRequests) => {
          const updatedFriendRequests = prevFriendRequests.filter((request) => request !== requester_id);
          return updatedFriendRequests;
        });
          setUpdated(true)
      })
    }
  }

  const handleDelete = (event,requester_id) => {
    event.preventDefault()
    if (token) {
      fetch(`http://localhost:3000/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          field: 'delete',
          requester: requester_id,
        }),
      }).then((response) => {

        setFriends((prevFriends) => {
          const updatedFriends = prevFriends.filter((request) => request !== requester_id);
          return updatedFriends;
        });
          setUpdated(true)
      })
    }
  }

  return (
    <>
    {friendRequestObjects.length > 0 && 
    (<>
      <h1>Friend requests</h1>
      <br></br>
      <div id="friendsList">
      {friendRequestObjects && friendRequestObjects.map((friendRequest) => {
      return (
        <div key={friendRequest._id} id="friend">
          <Link to={`/profile/${friendRequest._id}`}><h1>{friendRequest.name}</h1></Link>
          <img src={friendRequest.image} id="profile-pics" alt="img" />
          <br></br>
          <button onClick={(event) => handleAccept(event,friendRequest._id)}>Accept</button>
          <span>    </span>
          <button onClick={(event) => handleReject(event,friendRequest._id)}>Reject</button>
        </div>
      )
      })}
      </div>
      <br></br><br></br>
      </>)}
    
      {friendObjects.length > 0 && 
    (<>
      <h1>Friends</h1>
      <br></br>
      <div id="friendsList">
      {friendObjects && friendObjects.map((friend) => {
      return (
        <div key={friend._id} id="friend">
          <Link to={`/profile/${friend._id}`}><h1>{friend.name}</h1></Link>
          <img src={friend.image} id="profile-pics" alt="img" />
          <br></br>
          <button onClick={(event) => handleDelete(event,friend._id)}>Delete</button>
        </div>
      )
      })}
      </div>
      <br></br><br></br>
      </>)}




    </>
  )
}

export default FriendsList;


