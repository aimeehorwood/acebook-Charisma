import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import Comments from '../Comments/Comments'
import './Post.css'

const Post = ({ post, setUpdated, myProfilePage }) => {
  const [userName, setUserName] = useState(null)
  const [token, setToken] = useState(window.localStorage.getItem('token'))
  //const [error, setError] = useState(null);
  const [image, setImageUrl] = useState('')

  const hasBeenLiked = () => {
    return post.likes.includes(window.localStorage.getItem('user_id'))
  }

  const handleLikes = (event) => {
    event.preventDefault()
    if (token) {
      fetch(`http://localhost:3000/posts/${post._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          field: 'likes',
          value: window.localStorage.getItem('user_id'),
        }),
      }).then((response) => {
        setUpdated(true)
      })
    }
  }

  useEffect(() => {
    if (token) {
      fetch(`/users/${post.author}`)
        .then((response) => response.json())
        .then(async (data) => {
          //window.localStorage.setItem("token", data.token)
          //setToken(window.localStorage.getItem("token"))
          setUserName(data.user.name)

          setImageUrl(data.user.image)
        })
    }
  }, [])

  const handleDelete = async (event) => {
    event.preventDefault()
    if (token) {
      const confirm = window.confirm(
        'Are you sure you want to delete this post?',
      )
      if (!confirm) return
      const response = await fetch(`/posts/${post._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        setUpdated(true)
      } else {
        alert('Error deleting post')
        const data = await response.json()
        console.log(data)
      }
    }
  }

  return (
    <div id="post">
      <article data-cy="post" key={post._id}>
        <p id="userName">
          <img src={image} id="profile-pics" alt="img" />
          <Link to={`../profile/${post.author}`} style={{ fontSize: '30px' }}>
            {userName}
          </Link>
        </p>
        <br></br>
        <p id="postMessageContent">{post.message}</p>
        <br></br>
        <p id="timePosted" style={{ fontSize: '13px', fontStyle: 'italic' }}>
          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        </p>
        <br></br>
        <button onClick={handleLikes} id="like-button">
          {hasBeenLiked() ? (
            <>&#128078; Unlike {post.likes.length > 0 && post.likes.length}</>
          ) : (
            <>&#128077; Like {post.likes.length > 0 && post.likes.length}</>
          )}
        </button>
        {myProfilePage && (
          <button id="like-button" onClick={handleDelete}>
            Delete
          </button>
        )}
        <div>
          <br></br>
          <Comments post={post} token={token} setUpdated={setUpdated} />
        </div>
      </article>
    </div>
  )
}
export default Post
