import * as React from 'react';
import { useHistory } from 'react-router-dom';
import AppStorage from 'services/LocalStorage';

const Dashboard = () => {
  const appStorage = AppStorage.getInstance();
  const history = useHistory();

  const logout = () => {
    appStorage.clear();
    history.push('/', {
      loggedOut: true,
    });
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button type="button" onClick={logout}>
        Log out
      </button>
    </div>
  );
};

export default Dashboard;
