import React, {useEffect} from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase'; // Import your Firebase configuration

const Login = () => {

  const navigate = useNavigate();

  useEffect(() => {
    if(auth.currentUser){
      navigate('/reports');
    }
  });




  const signInWithGoogle = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      // You can access user information in the result object
      const user = result.user;
      console.log('Google Sign-In Successful:', user);
      navigate('/reports');
    } catch (error) {
      // Handle errors here
      console.error('Google Sign-In Failed:', error);
    }
  };

  return (
    // just a comment//
    <div className="text-center">
      <h2 className="text-4xl font-black mb-2">Chykalophia Reporting Tool</h2>
      <p className="text-regular mb-5">This login is so basic. Well, we still need to add stuff for sure. But MVP for now!</p>
      <button className="text-lg text-white bg-orange-300 py-3 px-5 rounded-md font-medium mb-5" onClick={signInWithGoogle}>Sign in with Google</button>

      <p className="mb-5 text-xs border-t pt-5">
        Hi Everyone!<br/><br/>
        Well, we just built this so that we'll have a proper system for our reporting.<br/>
        This thing is still under development, so there are some features that are still unavailable.<br/>
        It should run most of the stuff that we need when it comes to reporting though.<br/><br/>
        Enjoy,<br/>
        Eejay&nbsp;
      </p>
    </div>
  );
};

export default Login;
