import React from 'react';
import { TextValidator } from "react-material-ui-form-validator";
import { FormLabel, OutlinedInput, FormControlLabel, FormHelperText, MenuItem, Radio, Checkbox } from "@material-ui/core";
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { QuillValidator, FileValidator, SelectValidator, RadioGroupValidator, DatePickValidator, CheckboxValidator } from "./validators";

const legendStyles = {
  textAlign: 'left',
  marginTop: '16px',
  marginBottom: '8px'
}

const CustomLabel = ({ children }) => {
  return <FormLabel component="legend" style={legendStyles}>{children}</FormLabel>
}

function firebaseValidator(type, name, value, placeholder, eventHandler, error) {
  const checkError = error => {
    if (error.code.includes("email") || error.code.includes("argument")) {
      return true;
    } return false;
  }

  return (
    <OutlinedInput
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={eventHandler}
      error={error && checkError(error)}
    />
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
      <FileValidator
        {...customProps}
        validators={["isRequiredUpload"]}
        errorMessages={["Please upload an image."]} />
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
          <MenuItem value="none" disabled>Select One</MenuItem>
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
      {props.helperText && <FormHelperText>{props.helperText}</FormHelperText>}
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

export { RichTextField, FileUpload, firebaseValidator, AdminTextField,
TextField, CustomSelect, CustomRadioGroup, CustomCheckbox, CustomDatePicker }
