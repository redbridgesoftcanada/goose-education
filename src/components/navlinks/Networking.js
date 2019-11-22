import React from 'react';
import PropTypes from 'prop-types';
import { Button, Link } from '@material-ui/core'

function Networking(props) {
    const { classes } = props;

    return (
        <div>
            <Button aria-controls="networking-button" aria-haspopup="true">
              <Link
                color="inherit"
                variant="h6"
                underline="none"
                className={classes.rightLink}
                // component={}
              >
                {'Networking'}
              </Link>
            </Button>
        </div>
    );
};

Networking.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default Networking;