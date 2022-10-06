import { useEffect, useContext, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import DataContext from './context/DataContext'
import api from "./api/posts"

const EditPost = () => {

    const [editTitle, setEditTitle] = useState("")
    const [editBody, setEditBody] = useState("")

    const { posts, setPosts } = useContext(DataContext)
    const { id } = useParams()
    let navigate = useNavigate() 
    
    const post = posts.find(post => post.id.toString() === id)
    
    const handleEdit = async (id) => {
        const datetime = format(new Date(), "MMMM dd, yyyy pp")
        const updatedPost = {
          id,
          title: editTitle,
          datetime,
          body: editBody,
        }
        try {
          const response = await api.put(`/posts/${id}`, updatedPost)
          setPosts(posts.map(post => post.id === id ? {...response.data} : post ))
          setEditTitle("")
          setEditBody("")
          navigate("/")
        } catch (err) {
          console.log(`Error: ${err.message}`)
        }
      }

    // set the placeholder to the current title & body
    useEffect(() => {
        if(post) {
            setEditTitle(post.title)
            setEditBody(post.body)
        }
    }, [post, setEditTitle, setEditBody])

  return (
    <main className="NewPost">
        {!!editTitle 
        ? <>
            <h2>Edit Post</h2>
            <form className="newPostForm" onSubmit={(e) => {e.preventDefault()}}>
                <label htmlFor="postTitle">Title: </label>
                <input
                id="postTitle"
                type="text"
                required
                value={editTitle}
                onChange={(e) => {setEditTitle(e.target.value)}}
                />
                <label htmlFor="postBody">Post: </label>
                <textarea
                id="postBody"
                required
                value={editBody}
                onChange={(e) => {setEditBody(e.target.value)}}
                />
                <button type="submit" onClick={() => {handleEdit(post.id)}}>Submit</button>
            </form>
         </>
        : <>
            <h2>Page Not Found</h2>
            <p>Well, that's disappointing.</p>
            <p>
            <Link to={"/"}>Visit Our Homepage</Link>
            </p>
        </>
        }
    </main>
  )
}

export default EditPost