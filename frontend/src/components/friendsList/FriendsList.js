import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';


const FriendsList = ( {currentUser} ) => {
  const [token, setToken] = useState(window.localStorage.getItem("token"));
  const [friends, setFriends] = useState(currentUser.friends)
  const [friendObjects, setFriendObjects] = useState(null)
  const [friendRequests, setFriendRequests] = useState(currentUser.friendRequests)
  const [friendRequestObjects, setFriendRequestObjects] = useState(null)

  const [user, setUser] = useState(null)
  let { id } = useParams();

  const fetchFriend = async (friendId) => {
    if (friendId && token) {
    const response = await fetch(`/users/${friendId}`);
    const data = await response.json();
    return data.user;
  }
  }
  
  const friendsPromiseArray = friends.map(async (friend) => await fetchFriend(friend))
  console.log(friendsPromiseArray)
  const friendRequestsPromiseArray = friendRequests.map(async (friendRequest) => await fetchFriend(friendRequest))
  
 useEffect(() => {
    Promise.all(friendRequestsPromiseArray).then(resolvedData => setFriendRequestObjects(resolvedData))
  }, []) 

  useEffect(() => {
    Promise.all(friendsPromiseArray).then(resolvedData => setFriendObjects(resolvedData))

  }, [])


  const handleAccept = (event,requester_id) => {
    event.preventDefault()
    if (token) {
      fetch(`http://localhost:3000/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          field: 'accept',
          requester: requester_id,
        }),
      }).then((response) => {
        //set new token
        console.log('accepted')
      })
    }
  }

  const handleReject = () => {
    
  }

  return (
    <div id="friendsList">
      <h1>FRIEND REQUESTS</h1>
      {friendRequestObjects && friendRequestObjects.map((friendRequest) => {
      return (
        <div key={friendRequest._id} id="friend">
        <h1>hello {friendRequest.name}</h1>
        <button onClick={(event) => handleAccept(event,friendRequest._id)}>Accept</button><button onClick={handleReject}>Reject</button>
        </div>
      )
      })}
      <h1>FRIENDS</h1>
      {friendObjects && friendObjects.map((friend) => {
      return (
        <div key={friend._id} id="friend">
        <h1>hello {friend.name}</h1>
        </div>
      )
     })}
    </div>
  )
}

export default FriendsList;


