import React, { useEffect, useReducer } from 'react';
import { CircularProgress, Snackbar, Typography } from '@material-ui/core';
import { withAuthorization } from '../components/session';

// const styles = theme => {

// };

function toggleReducer(state, action) {
  switch(action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        user: action.payload,
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: true,
        isError: true,
        errorMessage: action.errorMessage
      };
    default: {
      throw new Error(`Unhandled type: ${action.type}.`)
    }
  }
}

function UserProfile({ authUser, firebase }) {
  const [ state, dispatch ] = useReducer(toggleReducer, {
    user: {},
    isLoading: false,
    isError: false,
  });

  useEffect(() => {
    const findUserById = async () => {
      dispatch({type: 'FETCH_INIT'});
      try {
        const response = await firebase.user(authUser.uid).get();
        let user = response.data();
        dispatch ({type: 'FETCH_SUCCESS', payload: user});
      } catch(error) {
        dispatch ({type: 'FETCH_FAILURE', errorMessage: 'Sorry, something went wrong!'});
      }
    }
    findUserById();
  }, []);

  return (
    <>
      { state.isError && 
        <Snackbar
          open={state.isError}
          autoHideDuration={1000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left'}}
          message={<Typography variant='subtitle2'>{state.errorMessage}</Typography>}
        />
      }

      { state.isLoading ? 
        <CircularProgress color='secondary'/> 
      :
        <>
          <Typography variant='h4'>Username: {state.user.username}</Typography>
          <Typography variant='h4'>Email: {state.user.email}</Typography>
        </>
      }
    </>
  );
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(UserProfile);
// export default withStyles(styles)(UserProfile);