import React from 'react';
import { TextValidator } from "react-material-ui-form-validator";
import { FormLabel, OutlinedInput, FormControlLabel, FormHelperText, MenuItem, Radio } from "@material-ui/core";
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { QuillValidator, FileValidator, SelectValidator, RadioGroupValidator, DatePickValidator, CheckboxValidator, DateTimePickValidator } from "./validators";

const legendStyles = {
  textAlign: 'left',
  marginTop: '16px',
  marginBottom: '8px'
}

const CustomLabel = ({ children }) => {
  return <FormLabel component="legend" style={legendStyles}>{children}</FormLabel>
}

function AuthLoginField(props) {
  const { error, ...customProps } = props;
  const checkError = error => {
    if (error.code.includes("email") || error.code.includes("argument")) {
      return true;
    } return false;
  }

  return (
    <TextValidator 
      fullWidth 
      variant="outlined" 
      InputLabelProps={{shrink: true}}
      error={error && checkError(error)}
      validators={['required', 'isQuillEmpty']}
      errorMessages={['', '']}
      {...customProps}/>
  )
}

function RichTextField(props) {
  return (
    <QuillValidator 
      {...props}
      validators={['required', 'isQuillEmpty']}
      errorMessages={['', '']}/>
  )
}

function FileUpload(props) {
  const { label, ...customProps } = props;
  return (
    <>
      <CustomLabel>{label}</CustomLabel>
      <FileValidator {...customProps}/>
    </>
  )
}

function TextField(props) {
  const { label, ...customProps } = props;
  return (
    <>
      <CustomLabel>{label}</CustomLabel>
      <TextValidator 
        fullWidth 
        variant="outlined" 
        InputLabelProps={{shrink: true}}
        {...customProps}/>
    </>
  )
}


function AdminTextField(props) {
  const configMultiId = (typeof props.name !== 'string') ? 
     { name: props.name.outer, id: props.name.inner } : { name: props.name }

  return (
    <OutlinedInput
      fullWidth
      {...props}
      {...configMultiId}
    />
  )
}

function CustomSelect(props) {
  const { options, ...customProps } = props;
  return (
    <>
      {props.label && <CustomLabel>{props.label}</CustomLabel>}
      <SelectValidator
        {...customProps}>
          {options.map((option, i) => 
            <MenuItem key={i} name={option} value={option}>
              {option}
            </MenuItem>
          )}
      </SelectValidator>
    </>
  )
}

function CustomRadioGroup(props) {
  const { label, options, ...customProps } = props;
  return (
    <>
      <CustomLabel>{label}</CustomLabel>
      {props.helpertext && <FormHelperText>{props.helpertext}</FormHelperText>}
      <RadioGroupValidator {...customProps}>
        {options.map((option, i) => 
          <FormControlLabel 
            key={i} 
            control={<Radio/>} 
            value={option.value || option} 
            label={option.label || option}/>
        )}
      </RadioGroupValidator>
    </>
  )
}

function CustomCheckbox(props) {
  const { additionalText, ...customProps } = props;
  return (
    <CheckboxValidator {...customProps}>
      {additionalText && <FormHelperText>{additionalText}</FormHelperText>}
    </CheckboxValidator>
  )
}

function CustomDatePicker(props) {
  const { label, ...customProps } = props;
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <CustomLabel>{label}</CustomLabel>
      <DatePickValidator {...customProps}/>
    </MuiPickersUtilsProvider>
  )
}

function CustomDateTimePicker(props) {
  const { label, ...customProps } = props;
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <CustomLabel>{label}</CustomLabel>
      <DateTimePickValidator {...customProps}/>
    </MuiPickersUtilsProvider>
  )
}

export { RichTextField, FileUpload, AuthLoginField, AdminTextField,
TextField, CustomSelect, CustomRadioGroup, CustomCheckbox, CustomDatePicker, CustomDateTimePicker }
