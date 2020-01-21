import React, { useEffect, useReducer } from 'react';
import { CircularProgress, Container, IconButton, Snackbar, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import { format } from 'date-fns';
import { withAuthorization } from '../components/session';

// const styles = theme => {

// };

const INITIAL_STATE = {
  isLoading: false,
  isError: false,
  application: null
}

function toggleReducer(state, action) {
  let { errorMessage, payload } = action;

  switch(action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false
      }
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        application: payload,
      }
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: true,
        isError: true,
        errorMessage: errorMessage
      }
    default: {
      throw new Error(`Unhandled type: ${action.type}.`)
    }
  }
}

function UserApplicationHistory({ authUser, firebase }) {
  const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);
  const { application } = state;

  useEffect(() => {
    const findSchoolApplicationById = async () => {
      dispatch({ type: 'FETCH_INIT' });
      try {
        const response = await firebase.schoolApplication(authUser.uid).get();
        let application = response.data();
        dispatch ({ type: 'FETCH_SUCCESS', payload: application });
      } catch(error) {
        dispatch ({ type: 'FETCH_FAILURE', errorMessage: 'Sorry, something went wrong!' });
      }
    }
    findSchoolApplicationById();
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
                { state.application ? 
                <TableRow>
                  <TableCell align='center'>1</TableCell>
                  <TableCell align='center'>{application.programName}, {application.schoolName}</TableCell>
                  <TableCell align='center'>{application.status}</TableCell>
                  <TableCell align='center'>{format(application.createdAt, 'Pp')}</TableCell>
                  <TableCell align='center'>
                    <IconButton size='small'>
                      <GetAppIcon />
                  </IconButton>
                  </TableCell>
                </TableRow>
                : 
                <TableRow>
                  <TableCell/>
                  <TableCell/>
                  <TableCell align='center'>You have no submitted applications.</TableCell>
                  <TableCell/>
                  <TableCell/>
                </TableRow>
                }
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