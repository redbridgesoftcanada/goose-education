import React from 'react';
import PropTypes from 'prop-types';
import { Button, Link } from '@material-ui/core';
import { Link as RouterLink } from "react-router-dom";

function EditProfile() {
    return (
      <Button variant="outlined">
        <Link
          color="inherit"
          variant="h6"
          underline="none"
          component={RouterLink}
          to="/profile/edit"
        >
          {'Edit'}
        </Link>
      </Button>
    );
};

EditProfile.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default EditProfile;