import React from 'react';
import { Box, Typography } from '@material-ui/core';

export default function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`scrollable-prevent-tabpanel-${index}`}
        aria-labelledby={`scrollable-prevent-tab-${index}`}
        {...other}
      >
        <Box pb={10}>{children}</Box>
      </Typography>
    );
}