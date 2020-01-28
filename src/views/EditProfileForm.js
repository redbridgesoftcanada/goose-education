import React, { useState } from 'react';
import { withFirebase } from '../components/firebase';
import { Button, Checkbox, FormControlLabel, FormHelperText, FormLabel, TextField, Typography, makeStyles } from "@material-ui/core";

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

const INITIAL_STATE = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  phoneNumber: '',
  mobileNumber: '',
  publicAccount: '',
  receieveEmails: '',
  receieveSMS: '',
  error: null,
};

const EditProfileFormBase = ({ firebase }) => {
  const classes = useStyles();
  const [ state, setState ] = useState({...INITIAL_STATE});
  const { email, error } = state;

  const isInvalid = email === '';

  const onChange = event => setState({ ...state, [event.target.name]: event.target.value });

  const onSubmit = event => {
      firebase.doPasswordReset(email)
      .then(() => setState({...INITIAL_STATE}))
      .catch(error => setState( error ));
  
      event.preventDefault();
  }

  return (
    <form className={classes.root} noValidate autoComplete="off" onSubmit={onSubmit}>
      
      { profileForm.map(field => {
          let camelCaseField = field.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });
          let capitalizedField = field.replace(/(?:_| |\b)(\w)/g, function($1){return $1.toUpperCase().replace('_',' ');});
          switch(field) {
            case 'public_account':
            case 'receive_emails':
            case 'receive_SMS':
              return (
                <div className={classes.formField}>
                  <FormControlLabel
                  control={<Checkbox checked={state[camelCaseField]} name={camelCaseField} 
                  // onChange={(event) => dispatch({ type: 'notifications', payload: event.target })} 
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
                <div className={classes.formField}>
                  <FormLabel>{capitalizedField}</FormLabel>
                  <TextField type="text" variant="outlined" fullWidth InputLabelProps={{ shrink: true }} name={camelCaseField}/>
                </div>
              );
          }
      })}

      <Button fullWidth disabled={isInvalid} type="submit">Submit</Button>
      {error && <Typography variant="subtitle1">{error.message}</Typography>}
    </form>
  )
}

const EditProfileForm = withFirebase(EditProfileFormBase);

export default EditProfileForm;