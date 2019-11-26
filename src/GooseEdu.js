import React from 'react';

import withRoot from './withRoot';
import NavBar from './views/NavBar';
// import HeaderBanner from './views/HeaderBanner';
import Footer from './views/Footer';

function GooseEdu() {
    return (
        <React.Fragment>
            <NavBar/>
            <Footer/>
        </React.Fragment>
    )
}

export default withRoot(GooseEdu);