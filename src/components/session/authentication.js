import React, { useState, useEffect } from 'react';
import AuthUserContext from './context';
import { withFirebase } from '../firebase';

const withAuthentication = Component => {
    const WithAuthentication = (props) => {
        const [ authUser, setAuthUser ] = useState(null);

        useEffect(() => {
            props.firebase.auth.onAuthStateChanged( authUser => {
                authUser ? setAuthUser(authUser) : setAuthUser(null);
            });
        }, [authUser]);

        return (
            <AuthUserContext.Provider value={authUser}>
                <Component {...props} />
            </AuthUserContext.Provider>
        )
    }
    return withFirebase(WithAuthentication);
}

export default withAuthentication;