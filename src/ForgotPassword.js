import React from 'react';

import withRoot from './withRoot';
import NavBar from './views/NavBar';
import ForgotPasswordForm from './views/ForgotPasswordForm';
import Footer from './views/Footer';

function ForgotPassword() {

  return (
    <>
      <NavBar />
      <ForgotPasswordForm/>
      <Footer />
    </>
  );
}

export default withRoot(ForgotPassword);