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
  //Firebase Config here
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
