import * as React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import LoginPage from 'domain/Login';
import Dashboard from 'domain/Dashboard';
import AuthRoute from 'components/AuthRoute';
import { PublicRoutes, AuthRoutes } from 'constants/routes';
import Permissions from 'constants/permissions';

// TODO: Prevent login / registration routes if authenticated
function App () {
  return (
    <Router>
      <Switch>
        <Route exact path={PublicRoutes.login} component={LoginPage} />
        <AuthRoute
          exact
          path={AuthRoutes.dashboard}
          Component={Dashboard}
          requiredPermissions={[
            Permissions.ViewDashboard,
          ]}
        />
      </Switch>
    </Router>
  );
}

export default App;
