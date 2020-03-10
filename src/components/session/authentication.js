import React, { useState, useEffect } from 'react';
import AuthUserContext from './context';
import { withFirebase } from '../firebase';

// higher-order component storing user object in local state + distributing to other components with React Context Provider

function withAuthentication(Component) {
    function WithAuthenticationComponent(props) {
        const [ authUser, setAuthUser ] = useState(null);

        useEffect(() => {
            props.firebase.onAuthUserListener (
                authUser => setAuthUser(authUser),      // next() callback function to firebase.onAuthUserListener (../firebase/firebase.js)
                () => setAuthUser(null)                 // fallback() callback function   "   "   " 
            );               
        }, []);

        return (
            <AuthUserContext.Provider value={authUser}>
                <Component {...props} />
            </AuthUserContext.Provider>
        )
    }
    return withFirebase(WithAuthenticationComponent);
}

export default withAuthentication;