import React, { Fragment, useReducer } from 'react';
import { Button, Checkbox, Container, FormControl, FormControlLabel, FormLabel, MenuItem, Radio, RadioGroup, Select, TextField, Typography, withStyles } from '@material-ui/core';
import { format } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

import { withAuthorization } from '../components/session';

const styles = theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
    },

    legend: {
        textAlign: 'left',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1)
    },
});

const applicationSections = {
    studentInfo: ['last_name', 'first_name', 'gender', 'birth_date', 'phone_number', 'email', 'emergency_contact_number', 'emergency_contact_relation', 'address', 'visa'],
    programInfo: ['school_name', 'program_name', 'program_duration', 'start_date'],
    otherInfo: ['insurance', 'arrival_date'],
};

// i n i t i a l i z i n g  s t a t e
let INITIAL_STATE = {
    isLoading: false,
    isError: false,
    agreeToPrivacy: false,
    additionalRequests: ''
};

Object.values(applicationSections).map(section => {
    section.map(field => {
        let camelCaseField = field.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });
        switch(field) {
            case 'birth_date':
            case 'start_date':
            case 'arrival_date':
                return INITIAL_STATE = {...INITIAL_STATE, [camelCaseField]: format(Date.now(), 'MM/dd/yyyy')}
            
            default:
                return INITIAL_STATE = {...INITIAL_STATE, [camelCaseField]: ''}
        }
    });
});

function toggleReducer(state, action) {
    let { type, payload } = action;
    let { name, value } = type;

    switch (type) {
        case 'birthDate':
        case 'startDate':
        case 'arrivalDate':
            return {
                ...state,
                [type]: format(payload, 'MM/dd/yyyy')
            }

        case 'checkbox':
            return {
                ...state,
                [payload.name]: payload.checked
            }
        
        case 'submit': 
            return {
                ...INITIAL_STATE
            }

        default:
            return {
                ...state,
                [name]: value
            }
        }
  }

function SchoolApplicationBase(props) {
    const { authUser, classes, firebase, history } = props;

    const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);

    const onSubmit = event => {
        const { isLoading, isError, agreeToPrivacy, ...applicationForm } = state;

        firebase.schoolApplication(authUser.uid).set({...applicationForm}, { merge: true }) 
        .then(() => {
            history.push('/profile');
            })
            .catch(error => 
            dispatch({ type: 'error', payload: error }));

            event.preventDefault();
    }

    return (
        <Container>
            <form className={classes.root} autoComplete="off" onSubmit={onSubmit}>
                { Object.values(applicationSections).map(section => { 
                    return section.map((field, i) => {
                        let camelCaseField = field.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });
                        let capitalizedField = field.replace(/(?:_| |\b)(\w)/g, function($1){return $1.toUpperCase().replace('_',' ');});

                        switch(field) {
                            case 'gender':
                                return (
                                    <Fragment key={i}>
                                        <FormLabel component="legend" className={classes.legend}>Gender</FormLabel>
                                        <RadioGroup
                                        name={camelCaseField}
                                        value={state[camelCaseField]}
                                        onChange={(event) => dispatch({ type: event.target })}
                                        >
                                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                                            <FormControlLabel value="other" control={<Radio />} label="Other" />
                                            <FormControlLabel value="undisclosed" control={<Radio />} label="Prefer Not To Say" />
                                        </RadioGroup> 
                                    </Fragment>
                                )
                            
                            case 'birth_date':
                            case 'start_date':
                            case 'arrival_date':
                                return (
                                    <MuiPickersUtilsProvider utils={DateFnsUtils} key={i}>
                                        <FormLabel component="legend" className={classes.legend}>{capitalizedField}</FormLabel>
                                        <KeyboardDatePicker
                                        disableToolbar
                                        variant="inline"
                                        format="MM/dd/yyyy"
                                        margin="normal"
                                        name={camelCaseField}
                                        value={state[camelCaseField]}
                                        onChange={(date) => dispatch({ type: camelCaseField, payload: date })}
                                        KeyboardButtonProps={{ 'aria-label': 'change date' }}
                                        />
                                    </MuiPickersUtilsProvider>
                                )

                            case 'visa':
                                return (
                                    <Fragment key={i}>
                                        <FormLabel component="legend" className={classes.legend}>VISA Status</FormLabel>
                                        <RadioGroup 
                                        name={camelCaseField}
                                        value={state[camelCaseField]}
                                        onChange={(event) => dispatch({ type: event.target })}
                                        >
                                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                            <FormControlLabel value="no" control={<Radio />} label="No" />
                                        </RadioGroup> 
                                    </Fragment>
                                )

                                case 'program_duration':
                                    return (
                                        <Fragment key={i}>
                                            <FormLabel component="legend" className={classes.legend}>{capitalizedField}</FormLabel>
                                            <FormControl className={classes.formControl}>
                                                <Select
                                                name={camelCaseField}
                                                value={state[camelCaseField]}
                                                onChange={(event) => dispatch({ type: event.target })}
                                                >
                                                    <MenuItem value={10}>10 Weeks</MenuItem>
                                                    <MenuItem value={20}>20 Weeks</MenuItem>
                                                    <MenuItem value={30}>30 Weeks</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Fragment>
                                    )
    
                            default:
                                return (
                                    <Fragment key={i}>
                                        <FormLabel component="legend" className={classes.legend}>{capitalizedField}</FormLabel>
                                        <TextField
                                        color="secondary"
                                        variant="outlined"
                                        name={camelCaseField}
                                        value={state[camelCaseField]}
                                        onChange={(event) => dispatch({ type: event.target })}
                                        type="text"
                                        placeholder={capitalizedField}
                                        />
                                    </Fragment>
                                )
                        }
                    })
                }) }

                <Typography variant="h6">Additional Requests</Typography>
                <TextField
                multiline
                rows="6"
                placeholder="Please fill in any other details here."
                variant="outlined"
                name='additionalRequests'
                value={state.additionalRequests}
                onChange={(event) => dispatch({ type: event.target })}
                />

                <Typography variant="h6">Privacy</Typography>
                <Typography align="left" variant="body2">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Typography>
                <FormControlLabel
                value="end"
                control={<Checkbox required size="small" checked={state.agreeToPrivacy} name='agreeToPrivacy' onChange={(event) => dispatch({ type: 'checkbox', payload: event.target })}/>}
                label={<Typography variant="body2">I agree to the Privacy Agreement.</Typography>}
                labelPlacement="end"
                />

            <Button variant="contained" color="secondary" type="submit">Submit Application</Button>
            </form>
        </Container>
    )
}

const schoolApplication = withStyles(styles)(SchoolApplicationBase);
const condition = authUser => !!authUser;

export default withAuthorization(condition)(schoolApplication);