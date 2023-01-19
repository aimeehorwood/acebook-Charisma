import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';


const FriendsList = ( { userFriends, userFriendRequests, setUpdated, updated} ) => {
  const [token, setToken] = useState(window.localStorage.getItem("token"));
  const [friends, setFriends] = useState(userFriends) ///the problem is here
  const [friendObjects, setFriendObjects] = useState(null)
  const [friendRequests, setFriendRequests] = useState(userFriendRequests) ///the problem is here
  const [friendRequestObjects, setFriendRequestObjects] = useState(null) 
  
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
        setFriendRequests(prevFriendRequests => prevFriendRequests.filter(request => request !== requester_id))
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
        setFriendRequests(prevFriendRequests => prevFriendRequests.filter(request => request !== requester_id))
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
        setFriends(prevFriends => prevFriends.filter(request => request !== requester_id))
        setUpdated(true)
      })
    }
  }
  return (
    <div id="friendsList">
      <h1>Friend requests</h1>
      {friendRequestObjects && friendRequestObjects.map((friendRequest) => {
      return (
        <div key={friendRequest._id} id="friend">
        <h1>hello {friendRequest.name}</h1>
        <button onClick={(event) => handleAccept(event,friendRequest._id)}>Accept</button><button onClick={(event) => handleReject(event,friendRequest._id)}>Reject</button>
        </div>
      )
      })}
      <h1>Friends</h1>
      {friendObjects && friendObjects.map((friend) => {
      return (
        <div key={friend._id} id="friend">
        <h1>hello {friend.name}</h1>
        <button onClick={(event) => handleDelete(event,friend._id)}>Delete</button>
        </div>
      )
     })}
    </div>
  )
}

export default FriendsList;


