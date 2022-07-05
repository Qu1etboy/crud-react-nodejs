import { useEffect, useState } from "react";
import axios from "axios";

const Posts = () => {
  const [username, setUsername] = useState('');
  const [id, setId] = useState(null);
  const [message, setMessage] = useState('');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // authorization
    // check the token. If match stay otherwise go to login page again.
    const token = localStorage.getItem('token');
    axios.post('http://localhost:8080/authen', null, {
      headers: {
        authorization: 'Bearar ' + token
      }
    })
    .then(res => res.data)
    .then(data => {
      if (data.status === 'ok') {
        // if authen success then let user see the post that other people sent.
        setUsername(data.decoded.username);
        // console.log(data.decoded);
        setId(data.decoded.userId);
        axios.get('http://localhost:8080/getPost')
          .then(res => {
            // console.log(res.data);
            setPosts(res.data)
          });
      } else {
        // alert('authen failed');
        window.location = '/';
      }
    })

  }, [])
  
  const addPost = () => {
    if (message.length > 255) {
      alert("Cant't have more than 255 characters");
      return
    }
    axios.post('http://localhost:8080/addPost', {
      name: username,
      id: id,
      message: message
    }).then((res) => {
      setPosts(res.data);
    })
  }

  const deletePost = (id) => {
    axios.delete(`http://localhost:8080/deletePost/${id}`)
      .then(res => {
        console.log(res.data);
        setPosts(posts.filter(post => post.postId != id));
      })
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold my-3">Welcome <span className="text-cyan-600">{username}</span></h1>
      <h1 className='text-xl font-bold'>Post page</h1>
      <div className="container-lg flex flex-col pt-5">
        <label>Write anything you want down here!</label>
        <textarea onInput={(e) => setMessage(e.target.value)} rows={5} cols={30} placeholder='your comment...' className="p-2 my-5 border-2 border-neutral-900 rounded-md"/>
        <input type='submit' onClick={addPost} className="p-2 m-1 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-800 duration-200 w-32 mx-auto"/>
      </div>
      <div className="flex flex-wrap justify-center w-[500px] gap-3 my-5">
        {posts.slice(0).reverse().map((post, idx) => (
          <div key={idx} className="p-5 border-2 rounded-md border-neutral-900 animate-popup">
            <div className="font-bold">{post.username}</div>
            <div>{post.post}</div>
            <div>{post.date}</div>
            {post.userID === id ? <button className="text-red-600" onClick={() => deletePost(post.postId)}>X</button> : ""}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Posts;