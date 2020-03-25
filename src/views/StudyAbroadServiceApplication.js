import React, { Fragment, useEffect, useReducer } from 'react';
import { useRouteMatch } from "react-router-dom";
import { Button, Checkbox, Container, FormControlLabel, FormLabel, OutlinedInput, Radio, RadioGroup, TextField, Typography, withStyles } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker, KeyboardTimePicker } from '@material-ui/pickers';
import { format } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { withAuthorization } from '../components/session';
import { convertToTitleCase } from '../constants/helpers';
import { PERSONAL_FIELDS, ARRIVAL_FIELDS, DEPARTURE_FIELDS, HOMESTAY_FIELDS } from '../constants/constants';

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

function toggleReducer(state, action) {
    const { type, payload } = action;

    switch (type) {
        case 'INITIALIZE_FORM':
            const { applicationType, applicationFormFields } = payload;

            const prepopulateInputs = {}
            applicationFormFields.map(field => {
                if (field.includes('date')) {
                    prepopulateInputs[field] = format(Date.now(), 'MM/dd/yyyy');
                } else if (field.includes('time')) {
                    prepopulateInputs[field] = Date.now();
                } else {
                    prepopulateInputs[field] = '';
                }
            });
            
            return {...state, ...prepopulateInputs, applicationType}
        
        case 'USER_INPUT': {
            const formField = payload.name;
            const formInput = payload.value;
            return {...state, [formField]: formInput}
        }

        case 'DATE_PICKER': {
            const formField = payload.field;
            const formInput = format(payload.date, 'MM/dd/yyyy');
            return {...state, [formField]: formInput}
        }

        case 'TIME_PICKER': {
            const formField = payload.field;
            const formInput = payload.date;
            return {...state, [formField]: formInput}
        }

        case 'CHECKBOX': {
            const formField = payload.name;
            const formInput = payload.checked;
            return {...state, [formField]: formInput}
        }
        
        case 'RESET': 
            return {...payload}

        default:
           console.log('No corresponding dispatch method in Study Abroad Service Application.')
        }
  }

function StudyAbroadServiceApplicationBase(props) {
    const { authUser, classes, firebase, history } = props;
    
    const INITIAL_STATE = {
        isLoading: false,
        isError: false,
        agreeToPrivacy: false
    };
    const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);

    // L O A D  A P P L I C A T I O N  F O R M  F I E L D S
    const match = useRouteMatch();
    const applicationType = (match.url.includes('homestay')) ? 'homestay' : 'airport';

    let applicationFormFields, firebaseRef;
    if (applicationType === 'homestay') {
        applicationFormFields = [PERSONAL_FIELDS, ARRIVAL_FIELDS, HOMESTAY_FIELDS].flat();
        firebaseRef = firebase.homestayApplication(authUser.uid);
    } else if (applicationType === 'airport') {
        applicationFormFields = [PERSONAL_FIELDS, ARRIVAL_FIELDS, DEPARTURE_FIELDS, HOMESTAY_FIELDS].flat();
        firebaseRef = firebase.airportRideApplication(authUser.uid);
    }

    // E V E N T  L I S T E N E R S
    const handleUserInput = event => dispatch({type:'USER_INPUT', payload: event.target});
    const handleDatePicker = (field, date) => dispatch({type:'DATE_PICKER', payload: { field, date }});
    const handleTimePicker = (field, date) => dispatch({type:'TIME_PICKER', payload: { field, date }});
    const handleCheckBox = event => dispatch({type: 'CHECKBOX', payload: event.target});

    const onSubmit = event => {
        const { isLoading, isError, agreeToPrivacy, applicationType, ...applicationForm } = state;
        firebaseRef.set({...applicationForm}, { merge: true })
        .then(() => {
            dispatch({type:'RESET', payload: INITIAL_STATE});
            history.push('/profile')
        });
        // .catch(error => dispatch({ type: 'error', payload: error }));
        event.preventDefault();
    }

    useEffect(() => {
        dispatch({type: 'INITIALIZE_FORM', payload: { applicationType, applicationFormFields }})
    }, []);

    return (
        <Container>
            <form className={classes.root} autoComplete="off" onSubmit={onSubmit}>
                {applicationFormFields.map((field, i) => {
                    const title = convertToTitleCase(field);       
                    if (field.includes('gender')) {
                        return (
                            <Fragment key={i}>
                                <FormLabel component="legend" className={classes.legend}>Gender</FormLabel>
                                <RadioGroup
                                name={field}
                                defaultValue={state[field]}
                                onChange={handleUserInput}>
                                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                                    <FormControlLabel value="other" control={<Radio />} label="Other" />
                                    <FormControlLabel value="undisclosed" control={<Radio />} label="Prefer Not To Say" />
                                </RadioGroup> 
                            </Fragment>
                        );
                    } else if (field.includes('date')) {
                        return (
                            <MuiPickersUtilsProvider key={i} utils={DateFnsUtils}>
                                <FormLabel component="legend" className={classes.legend}>{title}</FormLabel>
                                <KeyboardDatePicker
                                variant="inline"
                                format="MM/dd/yyyy"
                                margin="normal"
                                name={field}
                                value={state[field]}
                                onChange={date => handleDatePicker(field, date)}
                                KeyboardButtonProps={{ 'aria-label': 'change date' }}
                                />
                            </MuiPickersUtilsProvider>
                        );
                    } else if (field.includes('time')) {
                        return (
                            <MuiPickersUtilsProvider key={i} utils={DateFnsUtils}>
                                <FormLabel component="legend" className={classes.legend}>{title}</FormLabel>
                                <KeyboardTimePicker
                                variant="inline"
                                margin="normal"
                                name={field}
                                value={state[field]}
                                onChange={date => handleTimePicker(field, date)}
                                KeyboardButtonProps={{ 'aria-label': 'change time' }}/>
                            </MuiPickersUtilsProvider>
                        );
                    } else {
                        return (
                            <Fragment key={i}>
                                <FormLabel component="legend" className={classes.legend}>{title}</FormLabel>
                                <OutlinedInput
                                color="secondary"
                                name={field}
                                defaultValue={state[field]}
                                onChange={handleUserInput}/>
                            </Fragment>
                        );
                    }
                })}

                <Typography variant="h6">Additional Requests</Typography>
                <TextField
                multiline
                rows="6"
                placeholder="Please fill in any other details here."
                variant="outlined"
                name='additionalRequests'
                value={state.additionalRequests}
                onChange={handleUserInput}
                />

                <Typography variant="h6">Privacy</Typography>
                <Typography align="left" variant="body2">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Typography>
                <FormControlLabel
                value="end"
                control={<Checkbox required size="small" checked={state.agreeToPrivacy} name='agreeToPrivacy' onChange={handleCheckBox}/>}
                label={<Typography variant="body2">I agree to the Privacy Agreement.</Typography>}
                labelPlacement="end"
                />

                <Button variant="contained" color="secondary" type="submit">Submit Application</Button>
            </form>
        </Container>
    )
}

const studyAbroadServiceApplication = withStyles(styles)(StudyAbroadServiceApplicationBase);
const condition = authUser => !!authUser;

export default withAuthorization(condition)(studyAbroadServiceApplication);