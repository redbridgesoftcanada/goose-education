import React from 'react';
import { TextValidator } from "react-material-ui-form-validator";
import { FormLabel, OutlinedInput, FormControlLabel, FormHelperText, MenuItem, Radio, Checkbox } from "@material-ui/core";
import { QuillValidator, FileValidator, SelectValidator, RadioGroupValidator, DatePickValidator } from "./validators";

const legendStyles = {
  textAlign: 'left',
  marginTop: '16px',
  marginBottom: '8px'
}

const pickerStyles = {
  width: '100%'
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

function richTextValidator(name, value, eventHandler) {
  return (
    <QuillValidator
      defaultValue={value}
      onChange={value => eventHandler(name, value)}/>
  )
}

function fileValidator(name, value, eventHandler) {
  return (
    <FileValidator
      name={name}
      value={value}
      onChange={eventHandler}/>
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

function CustomSelect(props) {
  const { options, ...customProps } = props;
  return (
    <SelectValidator
      {...customProps}>
        <MenuItem value="" disabled>Select One</MenuItem>
        {options.map((option, i) => 
          <MenuItem key={i} name={option} value={option}>
            {option}
          </MenuItem>
        )}
    </SelectValidator>
  )
}

function CustomRadioGroup(props) {
  const { label, options, ...customProps } = props;
  return (
    <>
      <FormLabel component="legend" style={legendStyles}>{label}</FormLabel>
      <RadioGroupValidator {...customProps}>
        {options.map((option, i) => 
          <FormControlLabel 
            key={i} 
            control={<Radio/>} 
            value={option.value} 
            label={option.label}/>
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

export { richTextValidator, fileValidator, firebaseValidator,
TextField, CustomSelect, CustomRadioGroup, CustomCheckbox }
