import React from 'react';
import { ValidatorComponent } from 'react-form-validator-core';
import { Checkbox, FormControl, FormControlLabel, FormHelperText, Input, RadioGroup, Select, Typography } from '@material-ui/core';
import { KeyboardDatePicker, KeyboardDateTimePicker } from '@material-ui/pickers';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const errorStyles = {
  border: '1px solid #f44336',
  borderRadius: '4px',
  padding: '8px'
}

const errorContainer = {
  color: '#f44336'
}

const errorText = {
  fontSize: '0.75rem',
  margin: '0 14px',
  textAlign: 'left'
}

const CustomError = ({ children }) => {
  return (
    <div style={errorContainer}>
      <Typography style={errorText}>{children}</Typography>
    </div>
  )
}

class SelectValidator extends ValidatorComponent {  
  renderValidatorComponent() {
    const { children, errorMessages, validators, requiredError, validatorListener, value, ...rest } = this.props;
    return (
      <FormControl
        style={{ width: '100%'}}
        {...!this.state.isValid && { error: true }}>
        <Select
          displayEmpty
          variant='outlined'
          {...rest}>
            {children}
        </Select>
        <FormHelperText>{this.getErrorMessage()}</FormHelperText>
      </FormControl>
  )}
}

class QuillValidator extends ValidatorComponent {
  renderValidatorComponent() {
    const { errorMessages, validators, requiredError, validatorListener, value, ...rest } = this.props;
    return (
      <>
        <ReactQuill
          {...rest}
          {...!this.state.isValid && { style: errorStyles }}
        />
        {this.errorText()}
      </>
  )}
  
  errorText() {
    const { isValid } = this.state;
    if (isValid) return null;

    return <CustomError>{this.getErrorMessage()}</CustomError>
  }
}

class FileValidator extends ValidatorComponent {
  renderValidatorComponent() {
    const { errorMessages, validators, requiredError, validatorListener, value, ...rest } = this.props;
    return (
      <>
        <Input 
          type="file" 
          disableUnderline
          {...!this.state.isValid && { style: { ...errorStyles, width: '100%' } }}
          {...rest}/>
        {this.errorText()}
      </>
  )}

  errorText() {
    const { isValid } = this.state;
    if (isValid) return null;

    return <CustomError>{this.getErrorMessage()}</CustomError>
  }
}

class RadioGroupValidator extends ValidatorComponent {
  renderValidatorComponent() {
    const { errorMessages, validators, requiredError, validatorListener, value, ...rest } = this.props;
    return (
      <>
        <RadioGroup
        {...!this.state.isValid && { style: errorStyles }}
        {...rest}/>
        {this.errorText()}
      </>
  )}

  errorText() {
    const { isValid } = this.state;
    if (isValid) return null;

    return <CustomError>{this.getErrorMessage()}</CustomError>
  }
}

class DatePickValidator extends ValidatorComponent {
  renderValidatorComponent() {
    const { errorMessages, validators, requiredError, validatorListener, ...rest } = this.props;
    return (
      <KeyboardDatePicker
        autoOk
        variant="inline"
        inputVariant="outlined"
        format="MM/dd/yyyy"
        style={{ width: '100%'}}
        {...!this.state.isValid && { style: { ...errorStyles, width: '100%' } }}
        {...rest}/>
  )}
}

class CheckboxValidator extends ValidatorComponent {  
  renderValidatorComponent() {
    const { children, errorMessages, validators, requiredError, validatorListener, value, label, ...rest } = this.props;
    return (
      <FormControl 
        style={{ float: 'left' }}
        {...!this.state.isValid && { style: { ...errorStyles, float: 'left' } }}>
        <FormControlLabel 
          label={label}
          control={<Checkbox size="small" {...rest}/>}
        />
        {children}
        <FormHelperText>{this.getErrorMessage()}</FormHelperText>
      </FormControl>
  )}
}

class DateTimePickValidator extends ValidatorComponent {
  renderValidatorComponent() {
    const { errorMessages, validators, requiredError, validatorListener, ...rest } = this.props;
    return (
      <KeyboardDateTimePicker
        autoOk
        variant="inline"
        inputVariant="outlined"
        format="MM/dd/yyyy hh:mm a"
        style={{ width: '100%'}}
        {...!this.state.isValid && { style: { ...errorStyles, width: '100%' } }}
        {...rest}/>
  )}
}

export { SelectValidator, QuillValidator, FileValidator, RadioGroupValidator, DatePickValidator, CheckboxValidator, DateTimePickValidator }