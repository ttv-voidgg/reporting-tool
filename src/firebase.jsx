// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase, ref } from 'firebase/database';
import { getAuth, setPersistence, browserSessionPersistence, signOut } from 'firebase/auth';

const currentDate = new Date().toLocaleDateString('en-CA').replace(/\//g, '-'); // Format date as YYYY-MM-DD

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCb5oyXsR6ClqkEh_dIU_rPAEp6uXDS3Kk",
  authDomain: "reporting-tool-cf239.firebaseapp.com",
  databaseURL: "https://reporting-tool-cf239-default-rtdb.firebaseio.com",
  projectId: "reporting-tool-cf239",
  storageBucket: "reporting-tool-cf239.appspot.com",
  messagingSenderId: "806024298514",
  appId: "1:806024298514:web:c3d931720645b3854958cb",
  measurementId: "G-QR8XP9TKNQ"
};


const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // Initialize the database first

const auth = getAuth(app);
const companiesRef = ref(database, 'Companies');
const reportsRef = ref(database, 'Reports');

// Enable session persistence
setPersistence(auth, browserSessionPersistence)
  .then(() => {
    //console.log("Session persistence enabled");
  })
  .catch((error) => {
    //console.error("Error enabling session persistence:", error);
  });

  // signOut(auth)
  // .then(() => {
  //   console.log('User signed out successfully');
  // })
  // .catch((error) => {
  //   console.error('Error signing out:', error);
  // });

  //console.log(auth);

export { companiesRef, reportsRef, auth };