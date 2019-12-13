import React from 'react';
import PropTypes from 'prop-types';
import { Button, Link } from '@material-ui/core'
import { Link as RouterLink } from "react-router-dom";

function Networking(props) {
    const { classes } = props;

    return (
      <>
        <Button>
          <Link
            color="inherit"
            variant="h6"
            underline="none"
            className={classes.rightLink}
            component={RouterLink} 
            to=
              {{
                pathname: '/networking', 
                state: {
                  title: 'Networking'
                }
              }}
          >
            {'Networking'}
          </Link>
        </Button>
      </>
    );
};

Networking.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default Networking;