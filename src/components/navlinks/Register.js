import React from 'react';
import PropTypes from 'prop-types';
import { Button, Link } from '@material-ui/core'
import { Link as RouterLink } from 'react-router-dom';

function Register(props) {
    const { classes } = props;

    return (
        <div>
            <Button>
              <Link
                color="inherit"
                variant="h6"
                underline="none"
                className={classes.rightLink}
                component={RouterLink}
                to='/register'
              >
                {'Register'}
              </Link>
            </Button>
        </div>
    );
};

Register.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default Register;