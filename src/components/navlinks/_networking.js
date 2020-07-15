import React from 'react';
import { Button, Link } from '@material-ui/core'
import { Link as RouterLink } from "react-router-dom";

function Networking(classes) {

    return (
      <Button>
        <Link
          color="inherit"
          variant="h6"
          underline="none"
          className={classes.rightLink}
          component={RouterLink} 
          to={{ pathname: '/networking', state: { selected: 0 } }}>
            Networking
        </Link>
      </Button>
    );
};

export default Networking;