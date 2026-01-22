// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdorIe_BwQJsSqYdbX_jmw-z_ehJio9Fs",
  authDomain: "kanbanmate.firebaseapp.com",
  projectId: "kanbanmate",
  storageBucket: "kanbanmate.firebasestorage.app",
  messagingSenderId: "678428957949",
  appId: "1:678428957949:web:a142254dcc008f5cae3294",
  measurementId: "G-8QPJC9F00M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };