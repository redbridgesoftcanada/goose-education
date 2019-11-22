import React from 'react';
import PropTypes from 'prop-types';
import { Button, Link } from '@material-ui/core'

function Login(props) {
    const { classes } = props;

    return (
        <div>
            <Button aria-controls="login-button" aria-haspopup="true">
              <Link
                color="inherit"
                variant="h6"
                underline="none"
                className={classes.rightLink}
                // component={}
              >
                {'Login'}
              </Link>
            </Button>
        </div>
    );
};

Login.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default Login;