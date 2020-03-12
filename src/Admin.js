import React from 'react';
import withRoot from './withRoot';
import { withAuthorization } from './components/session';
import Dashboard from './views/admin/Dashboard';

function Admin() {
  return (
    <Dashboard />
  );
}

const condition = authUser => authUser && !!authUser.roles['admin'];

export default withAuthorization(condition)(withRoot(Admin));