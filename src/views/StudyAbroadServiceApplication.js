import React, { Fragment, useEffect, useReducer } from 'react';
import { useRouteMatch } from "react-router-dom";
import { Button, Checkbox, Container, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Typography, withStyles } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker, KeyboardTimePicker } from '@material-ui/pickers';
import { format } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';

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

const totalApplicationSections = {
    personalInfo: ['last_name', 'first_name', 'gender', 'birth_date', 'email', 'phone_number', 'emergency_contact_number', 'emergency_contact_relation', 'address'],
    arrivalInfo: ['arrival_flight_date', 'arrival_flight_time', 'arrival_flight_name'],
    homestayInfo: ['homestay_start_date', 'homestay_end_date'],
    departureInfo: ['departure_flight_date', 'departure_flight_time', 'departure_flight_name'],
};

let INITIAL_STATE = {
    isLoading: false,
    isError: false,
    agreeToPrivacy: false
};

function toggleReducer(state, action) {
    let { type, payload } = action;
    let { name, value } = type;

    switch (type) {
        case 'INITIALIZE_FORM':
            let applicationType = (payload.url.includes('homestay')) ? 'homestay' : 'airport';
            
            if (applicationType === 'homestay') {
                const { departureInfo, ...homestaySections } = totalApplicationSections;
                let homestayApplicationFields = [];
                Object.values({...homestaySections}).forEach(section => homestayApplicationFields.push(...section));
                
                homestayApplicationFields.forEach(field => {
                    let camelCaseField = field.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });
                    switch(field) {
                        case 'birth_date':
                        case 'homestay_start_date':
                        case 'homestay_end_date':
                        case 'arrival_flight_date':
                            return INITIAL_STATE = {...INITIAL_STATE, [camelCaseField]: format(Date.now(), 'MM/dd/yyyy')}
                        
                        case 'arrival_flight_time':
                            return INITIAL_STATE = {...INITIAL_STATE, [camelCaseField]: Date.now()}

                        default:
                            return INITIAL_STATE = {...INITIAL_STATE, [camelCaseField]: ''}
                    }
                });

            } else if (applicationType === 'airport') {
                let airportApplicationFields = [];
                Object.values(totalApplicationSections).forEach(section => airportApplicationFields.push(...section));

                airportApplicationFields.forEach(field => {
                    let camelCaseField = field.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });
                    switch(field) {
                        case 'birth_date':
                        case 'homestay_start_date':
                        case 'homestay_end_date':
                        case 'arrival_flight_date':
                        case 'departure_flight_date':
                            return INITIAL_STATE = {...INITIAL_STATE, [camelCaseField]: format(Date.now(), 'MM/dd/yyyy')}
                        
                        case 'arrival_flight_time':
                        case 'departure_flight_time':
                            return INITIAL_STATE = {...INITIAL_STATE, [camelCaseField]: Date.now()}

                        default:
                            return INITIAL_STATE = {...INITIAL_STATE, [camelCaseField]: ''}
                    }
                });
            }

            return { ...INITIAL_STATE, applicationType }

        case 'birthDate':
        case 'arrivalDate':
        case 'startDate':
        case 'endDate':
        case 'depatureDate':
            return {
                ...state,
                [type]: format(payload, 'MM/dd/yyyy')
            }

        case 'arrivalTime':
        case 'departureTime':
            return {
                ...state,
                [type]: format(payload, 'HH:mm')
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

function StudyAbroadServiceApplicationBase(props) {
    const { authUser, classes, firebase, history } = props;
    
    const [ state, dispatch ] = useReducer(toggleReducer, INITIAL_STATE);

    let applicationSections;
    let match = useRouteMatch();
    const { departureInfo, ...homestayForm } = totalApplicationSections;
    (match.url.includes('homestay')) ? applicationSections = {...homestayForm} : applicationSections = totalApplicationSections;

    const onSubmit = event => {
        // const { isLoading, isError, agreeToPrivacy, applicationType ...applicationForm } = state;

        // firebase.schoolApplication(authUser.uid).set({...applicationForm}, { merge: true }) 
        // .then(() => {
        //     history.push('/profile');
        //     })
        //     .catch(error => 
        //     dispatch({ type: 'error', payload: error }));

        //     event.preventDefault();
    }

    useEffect(() => { 
        dispatch ({ type: 'INITIALIZE_FORM', payload: match })
    }, []);

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
                                        defaultValue={state[camelCaseField]}
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
                                case 'arrival_flight_date':
                                case 'departure_flight_date':
                                case 'homestay_start_date':
                                case 'homestay_end_date':
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

                                case 'arrival_flight_time':
                                case 'departure_flight_time':
                                return (
                                    <MuiPickersUtilsProvider utils={DateFnsUtils} key={i}>
                                        <FormLabel component="legend" className={classes.legend}>{capitalizedField}</FormLabel>
                                        <KeyboardTimePicker
                                        variant="inline"
                                        margin="normal"
                                        name={camelCaseField}
                                        value={state[camelCaseField]}
                                        onChange={(date) => dispatch({ type: camelCaseField, payload: date })}
                                        KeyboardButtonProps={{ 'aria-label': 'change time' }}/>
                                    </MuiPickersUtilsProvider>
                                )

                            default:
                                return (
                                    <Fragment key={i}>
                                        <FormLabel component="legend" className={classes.legend}>{capitalizedField}</FormLabel>
                                        <TextField
                                        color="secondary"
                                        variant="outlined"
                                        name={camelCaseField}
                                        defaultValue={state[camelCaseField]}
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

const studyAbroadServiceApplication = withStyles(styles)(StudyAbroadServiceApplicationBase);
const condition = authUser => !!authUser;

export default withAuthorization(condition)(studyAbroadServiceApplication);