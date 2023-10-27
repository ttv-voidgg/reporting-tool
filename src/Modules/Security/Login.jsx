import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../firebase'; // Import your Firebase configuration

const Login = () => {
  const signInWithGoogle = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      // You can access user information in the result object
      const user = result.user;
      console.log('Google Sign-In Successful:', user);
    } catch (error) {
      // Handle errors here
      console.error('Google Sign-In Failed:', error);
    }
  };

  return (
    <div>
      <h2>Login with Google</h2>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
};

export default Login;
