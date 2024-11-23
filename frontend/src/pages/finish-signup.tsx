import React from 'react';
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { auth } from "@/firebase";
import { useNavigate } from 'react-router-dom';

const FinishSignup: React.FC = ({ setLoggedIn }) => {
    const navigate = useNavigate();

    if (isSignInWithEmailLink(auth, window.location.href)) {
        // Additional state parameters can also be passed via URL.
        // This can be used to continue the user's intended action before triggering
        // the sign-in operation.
        // Get the email if available. This should be available if the user completes
        // the flow on the same device where they started it.
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
            // User opened the link on a different device. To prevent session fixation
            // attacks, ask the user to provide the associated email again. For example:
            email = window.prompt('Please provide your email for confirmation');
        }
        // The client SDK will parse the code from the link for you.
        signInWithEmailLink(auth, email!, window.location.href)
            .then((_) => {
                // Clear email from storage.
                window.localStorage.removeItem('emailForSignIn');
                // You can access the new user by importing getAdditionalUserInfo
                // and calling it with result:
                // getAdditionalUserInfo(result)
                // You can access the user's profile via:
                // getAdditionalUserInfo(result)?.profile
                // You can check if the user is new or existing:
                // getAdditionalUserInfo(result)?.isNewUser
                console.log('Successfully signed in with email link!');
                setLoggedIn(true);
            })
            .catch((error) => {
                // Some error occurred, you can inspect the code: error.code
                // Common errors could be invalid email and invalid or expired OTPs.
                console.error(error);

                // Redirect to the login page
                navigate('/login');
            });
    }

    return (
        <div>
            <h1>Finish Signup</h1>
        </div>
    );
};

export default FinishSignup;


