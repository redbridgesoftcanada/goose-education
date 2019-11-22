import React from 'react';
import PropTypes from 'prop-types';
import { Button, Link } from '@material-ui/core'

function SignIn(props) {
    const { classes } = props;

    return (
        <div>
            <Button aria-controls="sign-in-button" aria-haspopup="true">
              <Link
                color="inherit"
                variant="h6"
                underline="none"
                className={classes.rightLink}
                // component={}
              >
                {'Sign In'}
              </Link>
            </Button>
        </div>
    );
};

SignIn.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default SignIn;