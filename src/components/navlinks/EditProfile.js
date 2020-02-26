import React from 'react';
import { Button, Link } from '@material-ui/core';
import { Link as RouterLink } from "react-router-dom";

export default function EditProfile(props) {
    return (
      <Button variant="outlined" size="small">
        <Link
          color="inherit"
          variant="h6"
          underline="none"
          component={RouterLink}
          to=
            {{
              pathname: '/profile/edit', 
              state: {
                user: props.user
              }
            }}
        >
          {'Edit'}
        </Link>
      </Button>
    );
};