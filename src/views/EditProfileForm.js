import React, { useState, useEffect } from 'react';
import { Button, Checkbox, FormControlLabel, FormHelperText, FormLabel, Snackbar, TextField, Typography, makeStyles } from "@material-ui/core";
import { withAuthorization } from '../components/session';

const useStyles = makeStyles(theme => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 500,
    },
  },

  formField: {
    display: 'flex',
    alignItems: 'center'
  },

}));

const profileForm = ['first_name', 'last_name', 'username', 'email', 'phone_number', 'mobile_number', 'receive_emails', 'receive_SMS', 'public_account'];

const EditProfileFormBase = (props) => {
  const classes = useStyles();
  const { authUser, firebase, user } = props;

  const INITIAL_STATE = {
    ...user,
    error: null
  };

  const [ state, setState ] = useState({...INITIAL_STATE});

  const { username, email, error } = state;
  const isInvalid = email === '';

  const onChange = event => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    setState({ ...state, [name]: value });
  }

  const onSubmit = event => {
    const { error, ...profileForm } = state;

    firebase.user(authUser.uid).update({...profileForm})
    .then(authUser => {
      const user = authUser.user;
      user.updateProfile({
        displayName: username,
        email
      });
    })
    .catch(error => setState(error));
  
    event.preventDefault();
  }

  return (
    <>
      {/* { isSaved && 
        <Snackbar
          open={isSaved}
          autoHideDuration={1000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left'}}
          message={<Typography variant='subtitle2'>Profile Saved.</Typography>}
        />
      } */}
    <form className={classes.root} noValidate autoComplete="off" onSubmit={onSubmit}>
      { profileForm.map((field, i) => {
          let camelCaseField = field.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });
          let capitalizedField = field.replace(/(?:_| |\b)(\w)/g, function($1){return $1.toUpperCase().replace('_',' ');});
          let specializedCamelCaseField = field.replace(/_/g, "");
          switch(field) {
            case 'receive_SMS':
            case 'receive_emails':
            case 'public_account':
              return (
                <div key={i} className={classes.formField}>
                  <FormControlLabel
                  control={<Checkbox {...(field === 'receive_SMS' ? { defaultChecked: state[specializedCamelCaseField], name: specializedCamelCaseField } : { defaultChecked: state[camelCaseField], name: camelCaseField })}
                  onChange={onChange} 
                  />}
                  label={capitalizedField}
                  />
                  <FormHelperText>
                    { field === 'public_account' ? 'Allow others to see my information. Please allow for 0 number of days for your account settings to be changed.' : 
                    field === 'receive_emails' ? 'I would like to receive email notifications.' : 
                    'I would like to receive SMS notifications. Additional charges may apply from your service provider.' }
                  </FormHelperText>
                </div>
              );
            
            default:
              return (
                <div key={i} className={classes.formField}>
                  <FormLabel>{capitalizedField}</FormLabel>
                  <TextField type="text" variant="outlined" fullWidth InputLabelProps={{ shrink: true }} 
                  name={camelCaseField}
                  defaultValue={state[camelCaseField]}
                  onChange={onChange}/>
                </div>
              );
          }
      })}

      <Button variant="contained" color="secondary" disabled={isInvalid} type="submit">Submit</Button>
      {error && <Typography variant="subtitle1">{error.message}</Typography>}
    </form>
    </>
  )
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(EditProfileFormBase);