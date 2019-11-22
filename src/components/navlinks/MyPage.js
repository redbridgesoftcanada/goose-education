import React from 'react';
import PropTypes from 'prop-types';
import { Button, Link } from '@material-ui/core'

function MyPage(props) {
    const { classes } = props;

    return (
        <div>
            <Button aria-controls="my-page-button" aria-haspopup="true">
              <Link
                color="inherit"
                variant="h6"
                underline="none"
                className={classes.rightLink}
                // component={}
              >
                {'My Page'}
              </Link>
            </Button>
        </div>
    );
};

MyPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default MyPage;