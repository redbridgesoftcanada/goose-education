import React from 'react';
import { Box, Button } from '@material-ui/core';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { withFirebase } from '../components/firebase';
import StyledValidators from '../components/customMUI';

function CommentDialog(props) {
  const { commentBody, handleChange, onClose, onSubmit } = props;

    return (
      <ValidatorForm onSubmit={onSubmit} style={{width: '100%'}}>
        <StyledValidators.TextField
          multiline
          value={commentBody}
          onChange={handleChange}
          validators={['required', 'isQuillEmpty']}
          errorMessages={['', '']}/>
        <Box style={{float: 'right'}}>
          <Button onClick={onClose}>CANCEL</Button>
          <Button type="submit" color="secondary">SAVE</Button>
        </Box>
      </ValidatorForm>
    );
}

export default withFirebase(CommentDialog);