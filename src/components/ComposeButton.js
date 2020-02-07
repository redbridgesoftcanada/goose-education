import React from 'react';
import { Button, withStyles } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';

const styles = theme => ({
    composeButton: {
        float: 'left',
        border: `2px solid ${theme.palette.secondary.main}`,
        marginRight: theme.spacing(1),

        '&:hover': {
            backgroundColor: theme.palette.secondary.main,
            color: '#FFF'
        }
    },
});

function Compose(props) {
    const { classes, handleComposeClick } = props;

    return (
        <Button
            variant='outlined'
            color='secondary'
            size='medium'
            className={classes.composeButton} 
            onClick={handleComposeClick}
            startIcon={<CreateIcon/>}
        >
            Compose
        </Button>
    )
}

export default withStyles(styles)(Compose);