import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-analytics.js";
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBxl8r_ikWEzdvOEHvI-RUO_IVjcbOdVo8",
  authDomain: "the-great-sage.firebaseapp.com",
  projectId: "the-great-sage",
  storageBucket: "the-great-sage.appspot.com",
  messagingSenderId: "870426263801",
  appId: "1:870426263801:web:38f3502550b59bb11c2228",
  measurementId: "G-YF8EKBBL4C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export {firebaseConfig, app, analytics,db}