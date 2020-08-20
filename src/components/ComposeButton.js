import React from 'react';
import { Button } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import { MuiThemeBreakpoints } from '../constants/constants';
import useStyles from '../styles/constants';

function Compose(props) {
    const classes = useStyles(props, 'buttons');
    const xsBreakpoint = MuiThemeBreakpoints().xs;
    const { handleComposeClick } = props;

    return (
        <Button
            className={classes.root} 
            color='secondary'
            variant='contained'
            size='medium'
            onClick={handleComposeClick}
            startIcon={<CreateIcon/>}
            {...!xsBreakpoint && { children: 'Compose' }}/>
    )
}

export default Compose;