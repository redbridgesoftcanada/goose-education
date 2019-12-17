import React from 'react';

import withRoot from './withRoot';
import NavBar from './views/NavBar';
import LoginForm from './views/LoginForm';
import Footer from './views/Footer';

function Login() {

  return (
    <>
      <NavBar />
      <LoginForm/>
      <Footer />
    </>
  );
}

export default withRoot(Login);