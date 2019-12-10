import React from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
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

function getSteps() {
  return ['학교 신청과 함께 필수 준비사항 중 하나 입니다.', '구스유학은 ‘안전’을 가장 중요시 합니다.', '신청은 캐나다 도착 최소 4주 전 또는 그 전에 신청해 주셔야 합니다.', '홈스테이 하우스 변경을 원할 시에 재배정에 관련되 비용이 발생될 수 있습니다.'];
}

function HorizontalLabelPositionBelowStepper(props) {
  const { classes } = props;
  const [activeStep] = React.useState(4);
  const steps = getSteps();

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} alternativeLabel style={{ backgroundColor: "#ff3366" }}>
        {steps.map((label, i) => (
          <Step key={i}>
            <StyledStepLabel>{label}</StyledStepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
      </div>
    </div>
  );
}

export default withStyles(styles)(HorizontalLabelPositionBelowStepper);