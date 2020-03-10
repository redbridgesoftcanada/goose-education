import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import AuthUserContext from './context';
import { withFirebase } from '../firebase';

// higher-order component handling redirects

const withAuthorization = condition => Component => {
    function WithAuthorizationComponent(props) {        
        
        useEffect(() => {
            props.firebase.onAuthUserListener(authUser => {
                if (!condition(authUser)) {                     // next() callback function to firebase.onAuthUserListener (../firebase/firebase.js)
                    props.history.pushState('/');
                }
            },
            () => props.history.push('/'));                     // fallback() callback function   "   "   " 
        }, []);
        
        return (
            <AuthUserContext.Consumer>
                { authUser => condition(authUser) ? <Component {...props} /> : null }
            </AuthUserContext.Consumer>
        );
    }
    return withRouter(withFirebase(WithAuthorizationComponent));
}

export default withAuthorization;