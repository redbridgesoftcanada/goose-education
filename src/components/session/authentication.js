import React, { useState, useEffect } from 'react';
import AuthUserContext from './context';
import { withFirebase } from '../firebase';

function withAuthentication(Component) {
    function WithAuthenticationComponent(props) {
        const [ authUser, setAuthUser ] = useState(null);

        useEffect(() => {
            props.firebase.auth.onAuthStateChanged( authUser => {
                authUser ? setAuthUser(authUser) : setAuthUser(null);
            });
        });

        return (
            <AuthUserContext.Provider value={authUser}>
                <Component {...props} />
            </AuthUserContext.Provider>
        )
    }
    return withFirebase(WithAuthenticationComponent);
}

export default withAuthentication;