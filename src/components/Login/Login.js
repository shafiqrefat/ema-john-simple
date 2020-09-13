import React, { useState } from 'react';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useContext } from 'react';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router-dom';

firebase.initializeApp(firebaseConfig);

function Login() {
  const [newUser,setNewUser] = useState(false);
  const [user,setUser] = useState({
    isSignedIn : false,
    name:'',
    email: '',
    password: '',
    photoURL: ''
  })

  const [loggedInUser,setLoggedInUser] = useContext(UserContext);
  const history = useHistory();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/" } };

  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();
  const handleSignIn = () =>{
    firebase.auth().signInWithPopup(googleProvider)
    .then(response =>{
      const {displayName,email,photoURL} = response.user;
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photoURL: photoURL
      }
      setUser(signedInUser);
    })
    .catch(error =>{
      // console.log(error);
      // console.log(error.message);
    })
  }

  const handleFbSignIn = () => {
    firebase.auth().signInWithPopup(fbProvider).then(function(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      console.log('Fb user after sign in',user);
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }
  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(response =>{
      const signedOutUser = {
        isSignedIn: false,
        newUser: false,
        name: '',
        email: '',
        error: '',
        success: false,
        photoURL: ''
      }
      setUser(signedOutUser)
    })
    .catch(error =>{

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
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(response => {
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);
        updateUserName(user.name)
      })
      .catch(error => {
        // Handle Errors here.
        const newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
        // ...
      });
    }
    if(!newUser && user.email && user.password){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(response =>{
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);
        setLoggedInUser(newUserInfo);
        history.replace(from);
        console.log('Sign In user info' , response.user)
      })
      .catch(function(error) {
        // Handle Errors here.
        const newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
        // ...
      });
    }
    event.preventDefault();
  }

  const updateUserName = name => {
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name
    }).then(function() {
      console.log('User Name Update Successfully');
    }).catch(function(error) {
      console.log(error);

    });
  }
  return (
    <div style={{textAlign: 'center'}} className="py-5">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button>:
        <button onClick={handleSignIn}>Sign in</button>
      }
      <br/>
      <button onClick={handleFbSignIn}>Sign In using Facebook</button>
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
