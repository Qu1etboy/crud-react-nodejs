import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function RegisterLogin() {
  // for register
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  // for login
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [isCorrect, setIsCorrect] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleRegister = (e) => {
    e.preventDefault();
    if (username.trim() === '') {
      alert('Username cannot be empty')
    }
    if (password !== confirmedPassword) {
      alert('Password is incorrect.');
    } else {
      // call backend with post method to insert username/password to database(mysql)
      axios.post('http://localhost:8080/register', {
        name: username,
        password: password
      })
      .then(res => console.log(res))
      .catch(err => console.log(err));


      // alert('Register successfully')      
      // console.log(username, password, confirmedPassword);
    }
  }

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/login', {
      name: loginUsername,
      password: loginPassword
    })
    .then(res => res.data)
    .then(data => {
      if (data.status === 'ok') {
        localStorage.setItem('token', data.token);
        alert('Login sucessfully');
        setIsCorrect(true);
        window.location = '/posts';
      }
      else { 
        setErrorMessage(data.message);
        setIsCorrect(false);
      }
    })
    .catch(err => console.log(err));
  }

  return (
    <div className='flex flex-col justify-center items-center mt-20 '>
      <div className='flex'>
        <form className='p-10 border-2 border-slate-500 rounded-md m-3 relative'>
          <h1 className='text-xl font-bold my-5'>Register</h1>
          <div className='flex flex-col gap-2'>
            <input className='p-2 border-2 border-neutral-900 rounded-md' placeholder='username' onChange={(e) => setUsername(e.target.value)}></input>
            <input className='p-2 border-2 border-neutral-900 rounded-md' placeholder='password' type='password' onChange={(e) => setPassword(e.target.value)}></input>
            <input className='p-2 border-2 border-neutral-900 rounded-md' placeholder='confirmed password' type='password' onChange={(e) => setConfirmedPassword(e.target.value)}></input>
          </div>
          <button className='p-2 bg-blue-600 hover:bg-blue-800 duration-200 rounded-md mt-2 text-white' onClick={handleRegister}>Register</button>
        </form>
        <form className='p-10 border-2 border-slate-500 rounded-md m-3 relative'>
          <h1 className='text-xl font-bold my-5'>Login</h1>
          <div className='flex flex-col gap-2'>
            <input className='p-2 border-2 border-neutral-900 rounded-md' placeholder='username' onChange={e => setLoginUsername(e.target.value)}></input>
            <input className='p-2 border-2 border-neutral-900 rounded-md' placeholder='password' type='password' onChange={e => setLoginPassword(e.target.value)}></input>
            {!isCorrect && <div className='p-3 rounded-md bg-red-500 text-white'>{errorMessage}</div>}
          </div>
          <button className='p-2 bg-blue-600 hover:bg-blue-800 duration-200 rounded-md mt-2 text-white' onClick={handleLogin}>Login</button>
          
        </form>
      </div>
    </div>
  );
}

export default RegisterLogin;
