import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';    // constructing className strings conditionally
import { Button, Link } from '@material-ui/core';
import { Link as RouterLink } from "react-router-dom";

function StudyAbroadCounseling(props) {
    const { classes } = props;

    return (
      <>
        <Button aria-controls="study-abroad-counselling-button" aria-haspopup="true">
          <Link
            color="inherit"
            variant="h6"
            underline="none"
            className={clsx(classes.rightLink, classes.linkSecondary)}
            component={RouterLink} 
            to=
            {{
              pathname: '/services', 
              state: {
                title: 'Service Centre',
                selected: 1
              }
            }}
          >
            {'Study Abroad Counselling'}
          </Link>
        </Button>
      </>
    );
};

StudyAbroadCounseling.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default StudyAbroadCounseling;