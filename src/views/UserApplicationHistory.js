import React, { useEffect, useReducer } from 'react';
import { CircularProgress, Container, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import { withAuthorization } from '../components/session';

// const styles = theme => {

// };

const INITIAL_STATE = {
  user: {},
  isLoading: false,
  isError: false
};

function toggleReducer(state, action) {
  let { errorMessage, payload } = action;

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
        user: payload,
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: true,
        isError: true,
        errorMessage: errorMessage
      };
    default: {
      throw new Error(`Unhandled type: ${action.type}.`)
    }
  }
}

function UserApplicationHistory({ authUser, firebase }) {
  const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);

  // useEffect(() => {
  //   const findUserById = async () => {
  //     dispatch({ type: 'FETCH_INIT' });
  //     try {
  //       const response = await firebase.user(authUser.uid).get();
  //       let user = response.data();
  //       dispatch ({ type: 'FETCH_SUCCESS', payload: user });
  //     } catch(error) {
  //       dispatch ({ type: 'FETCH_FAILURE', errorMessage: 'Sorry, something went wrong!' });
  //     }
  //   }
  //   findUserById();
  // }, []);

  // const { username, firstName, lastName, email, phoneNumber, mobileNumber, publicAccount, receieveEmails, receieveSMS } = state.user;
  // const { lastSignInTime, creationTime } = authUser.metadata;

  // const options = { weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
  // const formattedSignInTime = new Date(lastSignInTime).toLocaleDateString('en', options);
  // const formattedCreationTime = new Date(creationTime).toLocaleDateString('en', options);

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
          <Container>
            <Typography variant='h5'>School Application History</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align='center'>No</TableCell>
                  <TableCell align='center'>Content</TableCell>
                  <TableCell align='center'>Status</TableCell>
                  <TableCell align='center'>Date</TableCell>
                  <TableCell align='center'>Download</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* map application from DB */}
              </TableBody>
            </Table>
          </Container>
        </>
      }
    </>
  );
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(UserApplicationHistory);
// export default withStyles(styles)(UserProfile);