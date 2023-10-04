// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const companiesRef = ref(database, "Companies");

export default companiesRef;