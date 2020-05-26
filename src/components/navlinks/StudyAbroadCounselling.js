import React from 'react';
import clsx from 'clsx';    // constructing className strings conditionally
import { Button, Link } from '@material-ui/core';
import { Link as RouterLink } from "react-router-dom";

function StudyAbroadCounseling(props) {
  const { classes } = props;

  return (
    <>
      <Button>
        <Link
          color="inherit"
          variant="h6"
          underline="none"
          className={clsx(classes.rightLink, classes.linkSecondary)}
          component={RouterLink} 
          to={{pathname: '/services', state: { selected: 1 }}}>
            Study Abroad Counselling
        </Link>
      </Button>
    </>
  );
};

export default StudyAbroadCounseling;