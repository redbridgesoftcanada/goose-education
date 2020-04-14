import React from 'react';
import { TextValidator } from "react-material-ui-form-validator";
import { EditorValidator, FileValidator } from "./customValidators";
import { OutlinedInput, FormControlLabel, FormHelperText, Radio, RadioGroup } from "@material-ui/core";

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
  
  if (name === "type") {  // options = [SCHOOL_TYPES] (string) from SchoolsComposeForm
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
  return (
    <EditorValidator
      defaultValue={value}
      value={value} 
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

export { textField, radioField, textValidator, richTextValidator, fileValidator }