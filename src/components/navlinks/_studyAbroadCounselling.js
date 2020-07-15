import React from 'react';
import clsx from 'clsx';
import { Link } from '@material-ui/core';
import { Link as RouterLink } from "react-router-dom";

export default function StudyAbroadCounselling(classes, TransparentButton) {
  return (
    <>
      <TransparentButton>
        <Link
          className={clsx(classes.link, classes.linkSecondary)}
          component={RouterLink} 
          to={{pathname: '/services', state: { selected: 1 }}}>
            Study Abroad Counselling
        </Link>
      </TransparentButton>
    </>
  );
};