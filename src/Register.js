import React from 'react';

import withRoot from './withRoot';
import NavBar from './views/NavBar';
import RegisterForm from './views/RegisterForm';
import Footer from './views/Footer';

function Register() {

  return (
    <>
      <NavBar />
      <RegisterForm/>
      <Footer />
    </>
  );
}

export default withRoot(Register);