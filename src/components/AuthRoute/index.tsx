import React from 'react';
import { Redirect, Route, RouteComponentProps } from 'react-router-dom';
import { PublicRoutes } from 'constants/routes';
import UserStorage from 'services/LocalStorage';

type AuthRouteProps = {
  Component: React.FC<RouteComponentProps>;
  path: string;
  exact?: boolean;
  requiredPermissions: string[];
};

const userStorage = UserStorage.getInstance();

function tokenExists(): boolean {
  const token = userStorage.getAccessToken();
  return token !== null;
}

function getUserPermissions(): string[] {
  const user = userStorage.getUser();
  return user !== null ? user.permissions : [];
}

const AuthRoute = ({
  Component,
  path,
  exact = false,
  requiredPermissions,
}: AuthRouteProps) => {
  const isAuthenticated = tokenExists();
  const userPermissions = getUserPermissions();
  const isAuthorized = requiredPermissions
    .every((permission) => userPermissions.includes(permission));

  return (
    <Route
      exact={exact}
      path={path}
      render={(props: RouteComponentProps) => (
        isAuthenticated && isAuthorized ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: PublicRoutes.login,
              state: {
                requestedPath: path,
                unauthorized: true,
              },
            }}
          />
        ))}
    />
  );
};

export default AuthRoute;
