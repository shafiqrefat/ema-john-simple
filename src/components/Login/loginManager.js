import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

export const initializeLoginFramework = () => {
    if(firebase.apps.length === 0) {
        firebase.initializeApp(firebaseConfig);
    }
}

export const handleGoogleSignIn = () =>{
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(googleProvider)
    .then(response =>{
      const {displayName,email,photoURL} = response.user;
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photoURL: photoURL,
        success: true
      }
      return signedInUser;
    })
    .catch(error =>{
      // console.log(error);
      // console.log(error.message);
    })
  }

  export const handleFbSignIn = () => {
    const fbProvider = new firebase.auth.FacebookAuthProvider();
    return firebase.auth().signInWithPopup(fbProvider).then(function(result) {
      var token = result.credential.accessToken;
      var user = result.user;
      user.success = true;
      return user;
    })
    .catch(function(error) {
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

  export const handleSignOut = () => {
    return firebase.auth().signOut()
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
      return signedOutUser;
    })
    .catch(error =>{

    })
  }

  export const createUserWithEmailAndPassword = (name, email, password) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(response => {
      const newUserInfo = response.user;
      newUserInfo.error = '';
      newUserInfo.success = true;
      updateUserName(name);
      return newUserInfo;
    })
    .catch(error => {
      const newUserInfo = {};
      newUserInfo.error = error.message;
      newUserInfo.success = false;
      return newUserInfo;
    });
  }

  export const signInWithEmailAndPassword = (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password)
    .then(response =>{
      const newUserInfo = response.user;
      newUserInfo.error = '';
      newUserInfo.success = true;
      return newUserInfo;
    })
    .catch(function(error) {
      const newUserInfo = {};
      newUserInfo.error = error.message;
      newUserInfo.success = false;
      return newUserInfo;
    });
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