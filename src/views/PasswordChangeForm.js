import React, { useState } from 'react';
import { withFirebase } from '../components/firebase';
import { Button, FormLabel, TextField, makeStyles } from '@material-ui/core';

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

const INITIAL_STATE = {
    passwordOne: '',
    passwordTwo: '',
    error: null,
};

function PasswordChangeForm(props) {
    const classes = useStyles();
    const [ state, setState ] = useState({...INITIAL_STATE});
    const { passwordOne, passwordTwo, error } = state;

    // Firebase error objects have a message property by default, but only shown when there is an actual error using conditional rendering.
    const isInvalid = passwordOne !== passwordTwo || passwordOne === '';

    const onChange = event => setState({...state, [event.target.name]: event.target.value});
    const onSubmit = event => {
        props.firebase.doPasswordUpdate(passwordOne)
        .then(() => setState({ ...INITIAL_STATE }))
        .catch(error => setState({ error }));
        event.preventDefault();
    }

    return (
        <form className={classes.root} noValidate autoComplete="off" onSubmit={onSubmit}>
            <div className={classes.formField}>
                <FormLabel>New Password</FormLabel>
                <TextField
                    color="secondary"
                    variant="outlined"
                    name="passwordOne"
                    value={passwordOne}
                    onChange={onChange}
                    type="password"
                />
            </div>

            <div className={classes.formField}>
                <FormLabel>Confirm New Password</FormLabel>
                <TextField
                    color="secondary"
                    variant="outlined"
                    name="passwordTwo"
                    value={passwordTwo}
                    onChange={onChange}
                    type="password"
                />
            </div>

            <Button variant="contained" disabled={isInvalid} type="submit">Reset My Password</Button>
            {error && <p>{error.message}</p>}
        </form>
    );

}

export default withFirebase(PasswordChangeForm);