import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';    // constructing className strings conditionally
import { Button, Link } from '@material-ui/core';

function StudyAbroadCounseling(props) {
    const { classes } = props;

    return (
        <div>
            <Button aria-controls="study-abroad-counselling-button" aria-haspopup="true">
              <Link
                color="inherit"
                variant="h6"
                underline="none"
                className={clsx(classes.rightLink, classes.linkSecondary)}
                // component={}
              >
                {'Study Abroad Counselling'}
              </Link>
            </Button>
        </div>
    );
};

StudyAbroadCounseling.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default StudyAbroadCounseling;