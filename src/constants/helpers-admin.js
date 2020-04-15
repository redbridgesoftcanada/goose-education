import React from 'react';
import { TextValidator } from "react-material-ui-form-validator";
import { EditorValidator, FileValidator, SelectValidator } from "./customValidators";
import { OutlinedInput, FormControlLabel, FormHelperText, MenuItem, Radio, RadioGroup, Select } from "@material-ui/core";

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

function radioField(name, value, options, eventHandler, helperText) {
  // note. options needs to be an array of objects: {value, label}
  
  if (name === "type") {  // options = [SCHOOL_TYPES] (string) from SchoolsComposeForm;
    options = options.map(type => ({value:type, label:type}));
  }

  return (
    <>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      <RadioGroup name={name} value={value} onChange={eventHandler}>
        {options.map((option, i) => (
          <FormControlLabel key={i} value={option.value} control={<Radio/>} label={option.label} />
        ))}
      </RadioGroup>
    </>
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

// V A L I D A T I O N
function textValidator(name, value, eventHandler) {
  return (
    <TextValidator 
      variant="outlined" 
      fullWidth 
      InputLabelProps={{shrink: true}}
      name={name}
      value={value}
      onChange={eventHandler}
      validators={["required"]}
      errorMessages={[`Cannot submit an empty ${name}.`]}
    />
  )
}

function richTextValidator(name, value, eventHandler) {
  if (value) {
    return (
      <EditorValidator
        defaultValue={value}
        onChange={value => eventHandler(name, value)}
        validators={["isQuillEmpty"]}
        errorMessages={["Cannot submit an empty post."]}/>
    )
  }
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
  return (
    <SelectValidator
      variant="outlined"
      displayEmpty
      name={name}
      value={value}
      onChange={eventHandler}
      validators={['required']}
      errorMessages={['Please select a tag.']}>
        <MenuItem value="" disabled>Select One</MenuItem>
        {options.map((option, i) => {
            return <MenuItem key={i} name={option.name} value={option.value}>{option.value}</MenuItem>
        })}
    </SelectValidator>
  )
}

export { textField, radioField, selectField, textValidator, richTextValidator, fileValidator, selectValidator }