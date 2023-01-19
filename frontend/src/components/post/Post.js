import React, {useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import AddComment from '../addComment/AddComment'
import './Post.css';

const Post = ({post, setUpdated, myProfilePage}) => {
  const [userName, setUserName] = useState(null);
  const [token, setToken] = useState(window.localStorage.getItem("token"));
  //const [error, setError] = useState(null);
  const [body, setBody] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [addCommentForm, setAddCommentForm] = useState(false)
  const [image, setImageUrl] = useState("");


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

        .then(response => response.json())
        .then(async data => {
          //window.localStorage.setItem("token", data.token)
          //setToken(window.localStorage.getItem("token"))
          setUserName(data.user.name);

          setImageUrl(data.user.image);
        

        })
    }
  }, [])


  const handleDelete = async (event) => {
    event.preventDefault();
    if (token) {
      const confirm = window.confirm("Are you sure you want to delete this post?");
      if (!confirm) return;
      const response = await fetch(`/posts/${post._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setUpdated(true)
      } else {
        alert("Error deleting post")
        const data = await response.json();
        console.log(data);
      }
    }
  }



  const handleSubmit = (event) => { 
    event.preventDefault();
    if(token) {
      fetch( `/posts/${post._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          
        },
        body: JSON.stringify({
          'field': 'comments',
          'value': {
            'user_id': window.localStorage.getItem('user_id'),
            'message': `${body}`,
            'createdAt': `${new Date()}`,
            'name': window.localStorage.getItem('user_name')
        
          },
        })
      }).then(() => {
        setUpdated(true)
        setBody('') 
   
        
      })
      }
  }

  const firstComment = post.comments.length === 0 ? <p id ="first-comment">Be the first to make a comment!</p> :
  <p className ="bubble-post">
    <Link to={`../profile/${post.comments[0].user_id}`}><b>{post.comments[0].name}</b></Link>: {post.comments[0].message}
    <br></br><br></br><i style={{ fontSize: '13px' }}>{formatDistanceToNow(new Date(post.comments[0].createdAt), {addSuffix: true})}</i>
  </p>

 
  const allComments = 
    <div className="bubble-post">
      {post.comments.map((comments) => {
       return <p key={comments}> 
       <Link to={`../profile/${comments.user_id}`}><b>{comments.name}</b></Link>: {comments.message} <br></br><br></br> <i style={{ fontSize: '13px' }}> {`${formatDistanceToNow(new Date(comments.createdAt), {addSuffix: true})}`} </i> <br></br><br></br></p>
      })}
    </div>


  const showCommentsLink=showComments?'Hide':'Show'

  const commentForm =
  <form id ='input' onSubmit={handleSubmit}>
    <textarea id='input' rows="2" value={body} onChange={(event) => setBody(event.target.value)} />
    <button id="comment-button" type="submit" value="Submit">Comment</button>
  </form>

  const commentFormLink=addCommentForm?'Done':'Comment'


  return (
    <div id="post">
      <article data-cy="post" key={ post._id }>
      <p id="userName">
        <img src={image} id="profile-pics" alt="img" />
        <Link to={`../profile/${post.author}`} style={{ fontSize: '30px' }}>{userName}</Link>
      </p>
      <br></br>
      <p id='message-style' style={{fontSize: '24px'}}>{post.message}</p>
      <br></br>
      <p id='timePosted' style={{ fontSize: '13px', fontStyle: 'italic' }}>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</p>
      <br></br>
       <button onClick={handleLikes} id="like-button">
          {hasBeenLiked() ? (
            <>&#128078; Unlike {post.likes.length > 0 && post.likes.length}</>
          ) : (
            <>&#128077; Like {post.likes.length > 0 && post.likes.length}</>
          )}
        </button>
        {myProfilePage && <button id="like-button" onClick={handleDelete}>Delete</button>}
        <div>
          <br></br>
          <div id='comments' role="comments">
            {!showComments && firstComment}
            {showComments && allComments}
            <br></br>
            <button id="comment-button" onClick={() => {setShowComments(!showComments)}}><p>&#128064;{showCommentsLink}</p></button>   
            <button id="comment-button" onClick={() => {setAddCommentForm(!addCommentForm)}}><p>&#128172;{commentFormLink}</p></button>
          </div>
          <div id='add-comment'>
            {addCommentForm && commentForm}
          </div>
        </div>
      </article>
    </div>
  )
   
}
export default Post;
