import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { Link } from 'react-router-dom'
import React, { useState, useEffect } from 'react'

const Comments = ({ post, token, setUpdated }) => {
  const [showComments, setShowComments] = useState(false)
  const [addCommentForm, setAddCommentForm] = useState(false)
  const [body, setBody] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (token) {
      fetch(`/posts/${post._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          field: 'comments',
          value: {
            user_id: window.localStorage.getItem('user_id'),
            message: `${body}`,
            createdAt: `${new Date()}`,
            name: window.localStorage.getItem('user_name'),
          },
        }),
      }).then(() => {
        setUpdated(true)
        setBody('')
      })
    }
  }

  const firstComment =
    post.comments.length === 0 ? (
      <p id="first-comment" style={{ fontSize: '13px' }}>
        Be the first to make a comment!
      </p>
    ) : (
      <p className="bubble-post">
        <Link to={`../profile/${post.comments[0].user_id}`}>
          <b>{post.comments[0].name}</b>
        </Link>
        : {post.comments[0].message}
        <br></br>
        <br></br>
        <i style={{ fontSize: '13px' }}>
          {formatDistanceToNow(new Date(post.comments[0].createdAt), {
            addSuffix: true,
          })}
        </i>
      </p>
    )

  const allComments = (
    <div className="bubble-post">
      {post.comments.map((comments) => {
        return (
          <p key={comments.createdAt}>
            <Link to={`../profile/${comments.user_id}`}>
              <b>{comments.name}</b>
            </Link>
            : {comments.message} <br></br>
            <br></br>{' '}
            <i style={{ fontSize: '13px' }}>
              {' '}
              {`${formatDistanceToNow(new Date(comments.createdAt), {
                addSuffix: true,
              })}`}{' '}
            </i>{' '}
            <br></br>
            <br></br>
          </p>
        )
      })}
    </div>
  )

  const showCommentsLink = showComments ? 'Hide' : 'Show all'

  const commentForm = (
    <form id="input" onSubmit={handleSubmit}>
      <textarea
        id="input"
        rows="2"
        value={body}
        onChange={(event) => setBody(event.target.value)}
      />
      <br></br>
      <button id="comment-button" type="submit" value="Submit">
        Comment
      </button>
    </form>
  )

  const commentFormLink = addCommentForm ? 'Done' : 'Comment'

  return (
    <>
      <div id="comments" role="comments">
        {!showComments && firstComment}
        {showComments && allComments}
        <br></br>
        {post.comments.length > 1 && (
          <button
            id="comment-button"
            onClick={() => {
              setShowComments(!showComments)
            }}
          >
            <p>&#128064;{showCommentsLink}</p>
          </button>
        )}

        <button
          id="comment-button"
          onClick={() => {
            setAddCommentForm(!addCommentForm)
          }}
        >
          <p>&#128172;{commentFormLink}</p>
        </button>
      </div>
      <div id="add-comment">{addCommentForm && commentForm}</div>
    </>
  )
}

export default Comments
