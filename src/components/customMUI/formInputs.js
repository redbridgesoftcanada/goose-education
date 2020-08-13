import React from 'react';
import { TextValidator } from "react-material-ui-form-validator";
import { FormLabel, OutlinedInput, FormControlLabel, FormHelperText, MenuItem, Radio, RadioGroup, Select, Checkbox } from "@material-ui/core";
import { QuillValidator, FileValidator, SelectValidator, RadioGroupValidator, DatePickerValidator, DateTimePickerValidator } from "./validators";
import { convertToSentenceCase } from '../../constants/helpers/_features';

const legendStyles = {
  textAlign: 'left',
  marginTop: '16px',
  marginBottom: '8px'
}

const pickerStyles = {
  width: '100%'
}

// N O  V A L I D A T I O N
function textField(name, value, eventHandler, isMultiline) {
  return (
    <OutlinedInput
      variant="outlined"
      fullWidth
      name={name}
      value={value}
      onChange={eventHandler}
      {...(isMultiline === true) && {multiline: true, rows: 4}}
    />
  )
}

function defaultValueTextField(name, value, eventHandler, isMultiline) {
  const checkMultiIds = typeof name !== 'string';

  return (
    <OutlinedInput
      fullWidth
      defaultValue={value}
      onChange={eventHandler}
      {...(checkMultiIds) ? {name: name.outer, id: name.inner } : {name}}
      {...(isMultiline) && {multiline: true, rows: 4}}
    />
  )
}

function selectField(name, value, options, eventHandler) {
  // note. options needs to be an array (not of objects);

  return (
    <Select
      variant="outlined"
      displayEmpty
      name={name}
      value={value}
      onChange={eventHandler}>
        <MenuItem value="" disabled>Select One</MenuItem>
        {options.map((option, i) => {
            return <MenuItem key={i} name={option} value={option}>{option}</MenuItem>
        })}
    </Select>
  )
}
function customRadioGroup(name, value, options, onChangeHandler, label, helperText) {
  // note. options needs to be an array of objects: {value, label}
  
  if (name === "type") {  
    // options = [SCHOOL_TYPES] (string) from SchoolsComposeForm;
    options = options.map(type => ({value:type, label:type}));
  }

  return (
    <>
      <FormLabel component="legend" style={legendStyles}>{label}</FormLabel>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      <RadioGroup name={name} value={value} onChange={onChangeHandler}>
        {options.map((option, i) => (
          <FormControlLabel key={i} value={option.value} control={<Radio/>} label={option.label} />
        ))}
      </RadioGroup>
    </>
  )
}

function customCheckboxField(isChecked, name, label, text, onChangeHandler) {
  return (
    <>
    <FormControlLabel
      control={
        <Checkbox 
          size="small"
          checked={isChecked} 
          name={name} 
          onChange={onChangeHandler}
        />
      }
      label={label}
    />
    {text && <FormHelperText>{text}</FormHelperText>}
    </>
  )
}

// V A L I D A T I O N
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

function textValidator(name, value, handleValue, props) {
  const errorField = convertToSentenceCase(name);
  return (
    <TextValidator 
      fullWidth 
      variant="outlined" 
      InputLabelProps={{shrink: true}}
      name={name}
      value={value}
      onChange={handleValue}
      validators={["required", "isEmpty"]}
      errorMessages={[`${errorField} is required`, `Cannot submit an empty ${errorField.toLowerCase()}`]}
      {...props}
    />
  )
}

function customTextField(name, value, handleChange, customProps) {
  return (
    <TextValidator 
      variant="outlined" 
      fullWidth 
      InputLabelProps={{shrink: true}}
      name={name}
      value={value}
      onChange={handleChange}
      {...customProps}
    />
  )
}

function richTextValidator(name, value, eventHandler) {
  return (
    <QuillValidator
      defaultValue={value}
      onChange={value => eventHandler(name, value)}
      validators={["isQuillEmpty"]}
      errorMessages={["Cannot submit an empty post."]}/>
  )
}

function fileValidator(name, value, eventHandler) {
  return (
    <FileValidator
      disableUnderline
      name={name}
      value={value}
      onChange={eventHandler}
      validators={["isRequiredUpload"]}
      errorMessages={["Please upload an image."]} />
  )
}

function selectValidator(name, value, options, eventHandler) {
  // note. options needs to be an array;
  return (
    <SelectValidator
      variant="outlined"
      displayEmpty
      name={name}
      value={value}
      onChange={eventHandler}
      validators={['required']}
      errorMessages={['Please select an option.']}>
        <MenuItem value="" disabled>Select One</MenuItem>
        {options.map((option, i) => {
            return <MenuItem key={i} name={option} value={option}>{option}</MenuItem>
        })}
    </SelectValidator>
  )
}

function radioGroupValidator(name, value, options, eventHandler) {
  return (
    <RadioGroupValidator 
      name={name} 
      value={value} 
      onChange={eventHandler}
      validators={['required']}
      errorMessages={['Please select an option.']}>
      {options.map((option, i) => (
        <FormControlLabel 
          key={i} 
          value={option.value} 
          control={<Radio/>} 
          label={option.label}/>
      ))}
    </RadioGroupValidator>
  )
}

function customDatePicker(name, value, onChangeHandler, label, customProps) {
  return (
    <>
      <FormLabel component="legend" style={legendStyles}>{label}</FormLabel>
      <DatePickerValidator
        variant="inline"
        format="MM/dd/yyyy"
        name={name}
        value={value}
        onChange={onChangeHandler}
        {...customProps}
        />
    </>
  )
}

function customDateTimePicker(name, value, onChangeHandler, label, customProps) {
  return (
    <>
      <FormLabel component="legend" style={legendStyles}>{label}</FormLabel>
      <DateTimePickerValidator
      variant="inline"
      format="MM/dd/yyyy HH:mm"
      name={name}
      value={value}
      onChange={onChangeHandler}
      disablePast={true}
      {...customProps}
      />
    </>
  )
}


// ================================================================

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
      variant="outlined"
      displayEmpty
      {...customProps}>
        <MenuItem value="" disabled>Select One</MenuItem>
        {options.map((option, i) => 
          <MenuItem 
            key={i} 
            name={option} 
            value={option}>
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
  const { label, ...customProps } = props;
  return (
    <FormControlLabel
      label={label}
      control={<Checkbox size="small" {...customProps}/>}
    />
  )
      // {text && <FormHelperText>{text}</FormHelperText>}
}

function CustomDatePicker(props) {
  const { label, ...customProps } = props;
  return (
    <>
      <FormLabel component="legend" style={legendStyles}>{label}</FormLabel>
      <DatePickerValidator
        style={pickerStyles}
        variant="inline"
        format="MM/dd/yyyy"
        {...customProps}/>
    </>
  )
}

export { textField, customRadioGroup, selectField, customCheckboxField, customTextField, firebaseValidator, textValidator, richTextValidator, fileValidator, selectValidator, defaultValueTextField, radioGroupValidator, customDatePicker, customDateTimePicker,

TextField, CustomSelect, CustomRadioGroup, CustomCheckbox, CustomDatePicker }
