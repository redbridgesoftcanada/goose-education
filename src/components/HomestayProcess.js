import React from 'react';
import { Step, StepLabel, Stepper } from '@material-ui/core';
import { styled, withStyles } from '@material-ui/styles';

const StyledStepLabel = styled(StepLabel)({
  "& .MuiStepLabel-completed": {
    color: '#fff',
    fontSize: '15px',
    fontWeight: 600,
  }
});

const styles = theme => ({
  root: {
    width: '100%',
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
});

function HorizontalLabelPositionBelowStepper(props) {
  const { classes, body } = props;
  const [activeStep] = React.useState(4);
  const listOfSteps = Object.values(body).filter(step => typeof step !== 'string');

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} alternativeLabel style={{ backgroundColor: "#ff3366" }}>
        {listOfSteps.map((step, i) => (
          <Step key={i}>
            <StyledStepLabel>{step.title}</StyledStepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
      </div>
    </div>
  );
}

export default withStyles(styles)(HorizontalLabelPositionBelowStepper);