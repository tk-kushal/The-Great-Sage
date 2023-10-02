
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import {app} from "./firebase.js"

const auth = getAuth(app)
const provider = new GoogleAuthProvider();

function signIn() {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage)
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
}


export {auth,onAuthStateChanged,signIn}