import React from 'react';
import { TextValidator } from "react-material-ui-form-validator";
import { EditorValidator, FileValidator } from "./customValidators";

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

export { textValidator, richTextValidator, fileValidator }