import React from 'react';
import { Step, StepLabel, Stepper } from '@material-ui/core';
import { useStyles } from '../styles/studyAbroad';

export default function ProcessStepper(props) {
  const classes = useStyles(props, 'studyAbroadInformation');
  const listOfSteps = Object.values(props.body).filter(step => typeof step !== 'string');

  return (
    <Stepper alternativeLabel className={classes.step}>
      {listOfSteps.map((step, i) => (
        <Step key={i} active>
          <StepLabel classes={{active: classes.stepLabel, alternativeLabel: classes.stepLabel}}>{step.title}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}