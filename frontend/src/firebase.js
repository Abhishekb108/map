import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your Firebase configuration object from the Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyD81LM2OsoEXlJLO9fjND0LVcm1mCrDnQM",
    authDomain: "address-search-app-83917.firebaseapp.com",
    projectId: "address-search-app-83917",
    storageBucket: "address-search-app-83917.firebasestorage.app",
    messagingSenderId: "915592556115",
    appId: "1:915592556115:web:812e79e62b8101f90ce0a6",
    measurementId: "G-N6ZPQZ5M89"
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };