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

class SelectValidator extends ValidatorComponent {
  render() {
    const { children, errorMessages, validators, requiredError, validatorListener, value, ...rest } = this.props;
    return (
      <>
        <Select {...rest}>{children}</Select>
        {this.errorText()}
      </>
  )}

  errorText() {
    const { isValid } = this.state;
    if (isValid) return null;

    return <Typography style={helperTextMUI}>{this.getErrorMessage()}</Typography>
  }
}

class QuillValidator extends ValidatorComponent {
  render() {
    const { errorMessages, validators, requiredError, validatorListener, value, ...rest } = this.props;
    return (
      <>
        <ReactQuill {...rest}/>
        {this.errorText()}
      </>
  )}
  errorText() {
    const { isValid } = this.state;
    if (isValid) return null;

    return <Typography style={helperTextMUI}>{this.getErrorMessage()}</Typography>
  }
}


class FileValidator extends ValidatorComponent {
  render() {
    const { errorMessages, validators, requiredError, validatorListener, value, ...rest } = this.props;
    return (
      <>
        <Input type="file" {...rest}/>
        {this.errorText()}
      </>
  )}

  errorText() {
    const { isValid } = this.state;
    if (isValid) return null;

    return <Typography style={helperTextMUI}>{this.getErrorMessage()}</Typography>
  }
}

export { SelectValidator, QuillValidator, FileValidator }