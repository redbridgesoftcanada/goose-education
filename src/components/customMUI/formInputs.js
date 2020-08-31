import React from 'react';
import { TextValidator } from "react-material-ui-form-validator";
import { FormLabel, OutlinedInput, FormControlLabel, FormHelperText, MenuItem, Radio, Checkbox } from "@material-ui/core";
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { QuillValidator, FileValidator, SelectValidator, RadioGroupValidator, DatePickValidator } from "./validators";

const legendStyles = {
  textAlign: 'left',
  marginTop: '16px',
  marginBottom: '8px'
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
      <FormLabel component="legend" style={legendStyles}>{label}</FormLabel>
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
      <FormLabel component="legend" style={legendStyles}>{label}</FormLabel>
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
      {props.label && <FormLabel component="legend" style={legendStyles}>{props.label}</FormLabel>}
      <SelectValidator
        {...customProps}>
          <MenuItem value="" disabled>Select One</MenuItem>
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
      <FormLabel component="legend" style={legendStyles}>{label}</FormLabel>
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
  const { label, additionalText, ...customProps } = props;
  return (
    <>
      <FormControlLabel
        label={label}
        control={<Checkbox size="small" {...customProps}/>}
      />
      {additionalText && <FormHelperText>{additionalText}</FormHelperText>}
    </>
  )
}

function CustomDatePicker(props) {
  const { label, ...customProps } = props;
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <FormLabel component="legend" style={legendStyles}>{label}</FormLabel>
      <DatePickValidator {...customProps}/>
    </MuiPickersUtilsProvider>
  )
}

export { RichTextField, FileUpload, firebaseValidator, AdminTextField,
TextField, CustomSelect, CustomRadioGroup, CustomCheckbox, CustomDatePicker }
