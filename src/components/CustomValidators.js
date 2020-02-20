import React from 'react';
import { ValidatorComponent } from 'react-form-validator-core';
import { Input, Select, Typography } from '@material-ui/core';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const helperTextMUI = {
  color: '#f44336',
  fontSize: '0.75rem',
  margin: '8px 14px 0',
}

function createErrorText(state, getErrorMessage) {
  const { isValid } = state;
  if (isValid) {
    return null;
  }
  return <Typography style={helperTextMUI}>{getErrorMessage}</Typography>;
}

class SelectValidator extends ValidatorComponent {
  render() {
    const { children, errorMessages, validators, requiredError, validatorListener, value, ...rest } = this.props;
    return (
      <>
        <Select {...rest}>{children}</Select>
        {createErrorText(this.state, this.getErrorMessage())}
      </>
  )}
}

class EditorValidator extends ValidatorComponent {
  render() {
    const { errorMessages, validators, requiredError, validatorListener, value, ...rest } = this.props;
    return (
      <>
        <ReactQuill {...rest}/>
        {createErrorText(this.state, this.getErrorMessage())}
      </>
  )}
}

class FileValidator extends ValidatorComponent {
  render() {
    const { errorMessages, validators, requiredError, validatorListener, value, ...rest } = this.props;
    const { isValid } = this.state;
    return (
      <>
        <Input type="file" {...rest}
        error={!isValid}/>
        {createErrorText(this.state, this.getErrorMessage())}
      </>
  )}
}

export { SelectValidator, EditorValidator, FileValidator }