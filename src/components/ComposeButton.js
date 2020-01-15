import React from 'react';
import { Button, withStyles } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';

const styles = theme => ({
    composeButton: {
        float: 'left',
        color: theme.palette.secondary.main,
        border: `2px solid ${theme.palette.secondary.main}`,
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        marginRight: theme.spacing(1),
    },
});

function Compose(props) {
    const { classes, handleComposeClick } = props;

    return (
        <>
            <Button 
                className={classes.composeButton} 
                onClick={handleComposeClick}
                startIcon={<CreateIcon/>}
            >
                Compose
            </Button>
        </>
    )
}

export default withStyles(styles)(Compose);