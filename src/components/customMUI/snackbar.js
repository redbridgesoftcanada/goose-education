import React from 'react';
import { Box, Snackbar, SnackbarContent, Typography } from "@material-ui/core";
import { CheckCircleOutline, ErrorOutline } from '@material-ui/icons';

export default function StatusSnackbar({ action, message, onClose }) {
  let contentFormat = {};
  switch(action) {
    case 'error': 
      contentFormat.style = { backgroundColor: '#bf1f22' };
      contentFormat.icon = <ErrorOutline/>;
      break;
    
    case 'success':
      contentFormat.style = {};
      contentFormat.icon = <CheckCircleOutline/>;
      break;

    default:
      console.log('Missing action type for snackbar.')
      break;
  }

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left'}}
      open={!!message}
      autoHideDuration={5000}
      onClose={onClose}
    >
      <SnackbarContent 
        style={contentFormat.style}
        message={
          <Box display='flex' alignItems='center'>
            {contentFormat.icon}
            <Typography variant='body2' style={{ marginLeft: 8 }}>{message}</Typography>
          </Box>
        }
      />
    </Snackbar>
  )
}