import React, { useState } from 'react';
import { useContext } from 'react';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router-dom';
import { handleGoogleSignIn, initializeLoginFramework, handleSignOut, handleFbSignIn, createUserWithEmailAndPassword, signInWithEmailAndPassword } from './loginManager';

function Login() {
  const [newUser,setNewUser] = useState(false);
  const [user,setUser] = useState({
    isSignedIn : false,
    name:'',
    email: '',
    password: '',
    photoURL: ''
  })

  initializeLoginFramework();
  const [loggedInUser,setLoggedInUser] = useContext(UserContext);
  const history = useHistory();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/" } };

  const googleSignIn = () => {
      handleGoogleSignIn()
      .then(response =>{
          setUser(response);
          setLoggedInUser(response);
          history.replace(from);
        })
  }

  const fbSignIn = () => {
      handleFbSignIn
      .then(response =>{
        setUser(response);
        setLoggedInUser(response);
        })
    }


  const signOut = () =>{
    handleSignOut()
    .then(response =>{
        setUser(response);
        setLoggedInUser(response);
    })
  }
  
  const handleBlur = (event) => {
    let isFieldValid = true;
    if (event.target.name === 'email'){
      isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);
    }
    if (event.target.name === 'password'){
      const isPasswordValid = event.target.value.length>6;
      const passwordHasNumber = /\d{1}/.test(event.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber;
    }
    if (isFieldValid){
      const newUserInfo = {...user};
      newUserInfo[event.target.name] = event.target.value;
      setUser(newUserInfo);
    }
  }
  const handleSubmit = (event) => {
    if(newUser && user.email && user.password){
      createUserWithEmailAndPassword(user.name, user.email, user.password)
      .then(response => {
        setUser(response);
        setLoggedInUser(response);
        history.replace(from);
      })
    }
    if(!newUser && user.email && user.password){
      signInWithEmailAndPassword(user.email, user.password)
      .then(response => {
        setUser(response);
        setLoggedInUser(response);
        history.replace(from);
      })
    }
    event.preventDefault();
  }

  return (
    <div>
      {
        user.isSignedIn ? <button onClick={signOut}>Sign Out</button>:
        <button onClick={googleSignIn}>Sign in</button>
      }
      <br/>
      <button onClick={fbSignIn}>Sign In using Facebook</button>
      {
        user.isSignedIn && 
        <div>
           <p>Welcome , {user.name} !</p>
           <p>Your email : {user.email}</p>
           <img src={user.photoURL} alt=""/>
        </div>
      }
      <h1>Our own Authentication</h1>
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id=""/>
      <label htmlFor="newUser">New user sign up</label>
      <form onSubmit={handleSubmit}>
        {newUser && <input name="name" type="text" onBlur={handleBlur} placeholder="Your Name"/>}
        <br/>
        <input type="text" name="email" onBlur={handleBlur} placeholder="Enter your Email" required/>
        <br/>
        <input type="password" name="password" onBlur={handleBlur} placeholder="Enter your Password" id="" required/>
        <br/>
        <input type="submit" value={newUser ? 'Sign Up' : 'Sign In'}/>
        <p style={{color: 'red'}}>{user.error}</p>
        {user.success && <p style={{color: 'green'}}>User {newUser ? 'Created' : 'Logged In'} Successfully</p>}
      </form>

    </div>
  );
}

export default Login;
